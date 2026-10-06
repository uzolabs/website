import { erc20Abi, getAddress, isAddress, parseEther, parseUnits, type Address } from "viem"
import {
  cooldownHours,
  faucetAddress,
  faucetAmount,
  faucetEnabled,
  publicClient,
  sendTestnetTokens,
  sendTestUsdt,
  usdtAddress,
  usdtAmount,
  usdtEnabled,
  usdtSymbol,
} from "@/lib/faucet"
import { isFaucetTokenId, type FaucetErrorCode, type FaucetTokenId } from "@/lib/faucet-errors"
import { testnet } from "@/lib/network"

// Best effort only: this lives in one function instance's memory, so it resets on cold
// starts and is not shared across instances. Swap for a shared store before a wide launch.
const lastClaim = new Map<string, number>()

// A plain transfer costs 21,000 gas. Pad it so a small price bump does not fail the send.
const transferGas = BigInt(25_000)
// An ERC-20 transfer to a fresh holder runs around 50,000 gas. Same padding idea.
const tokenTransferGas = BigInt(80_000)

function fail(status: number, code: FaucetErrorCode, error: string, extra: Record<string, unknown> = {}) {
  return Response.json({ code, error, ...extra }, { status })
}

/** Everything a claim needs to know about one token, read fresh from the chain. */
type ClaimPlan = {
  symbol: string
  label: string
  amount: bigint
  recipientBalance: bigint
  faucetTokenBalance: bigint
  faucetGasBalance: bigint
  gasCost: bigint
  send: () => Promise<`0x${string}`>
}

async function planClaim(token: FaucetTokenId, to: Address, from: Address, gasPrice: bigint): Promise<ClaimPlan> {
  if (token === "usdt" && usdtAddress) {
    const contract = { address: usdtAddress, abi: erc20Abi } as const
    const [decimals, recipientBalance, faucetTokenBalance, faucetGasBalance] = await Promise.all([
      publicClient.readContract({ ...contract, functionName: "decimals" }),
      publicClient.readContract({ ...contract, functionName: "balanceOf", args: [to] }),
      publicClient.readContract({ ...contract, functionName: "balanceOf", args: [from] }),
      publicClient.getBalance({ address: from }),
    ])
    const amount = parseUnits(usdtAmount, decimals)
    return {
      symbol: usdtSymbol,
      label: usdtAmount,
      amount,
      recipientBalance,
      faucetTokenBalance,
      faucetGasBalance,
      gasCost: gasPrice * tokenTransferGas,
      send: () => sendTestUsdt(to, amount),
    }
  }

  const [recipientBalance, faucetGasBalance] = await Promise.all([
    publicClient.getBalance({ address: to }),
    publicClient.getBalance({ address: from }),
  ])
  const amount = parseEther(faucetAmount)
  return {
    symbol: testnet.nativeToken,
    label: faucetAmount,
    amount,
    recipientBalance,
    // tBOT is both what gets sent and what pays gas, so hold the gas back before comparing.
    faucetTokenBalance: faucetGasBalance - gasPrice * transferGas,
    faucetGasBalance,
    gasCost: gasPrice * transferGas,
    send: () => sendTestnetTokens(to),
  }
}

export async function POST(request: Request) {
  if (!faucetEnabled) return fail(503, "disabled", "The Uzo faucet is not switched on yet.")

  let address: unknown
  let token: unknown
  try {
    ;({ address, token = "tbot" } = await request.json())
  } catch {
    return fail(400, "invalid_address", "Send a JSON body with an address.")
  }
  if (!isFaucetTokenId(token) || (token === "usdt" && !usdtEnabled)) {
    return fail(400, "token_unavailable", "The faucet is not handing out that token right now.")
  }
  if (typeof address !== "string" || !isAddress(address.trim(), { strict: false })) {
    return fail(400, "invalid_address", "That does not look like a valid wallet address.")
  }
  const to: Address = getAddress(address.trim())
  const from = faucetAddress()
  if (to === from) return fail(400, "self_address", "That is the faucet's own address.")

  // Each token has its own cooldown, so claiming tBOT does not block claiming USDT.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const keys = [`${token}:addr:${to}`, `${token}:ip:${ip}`]
  const now = Date.now()
  const windowMs = cooldownHours * 60 * 60 * 1000
  for (const key of keys) {
    const last = lastClaim.get(key)
    if (last && now - last < windowMs) {
      const hours = Math.ceil((windowMs - (now - last)) / 3_600_000)
      return fail(429, "cooldown", `You claimed recently. Try again in about ${hours} hour${hours === 1 ? "" : "s"}.`, {
        retryAfterHours: hours,
      })
    }
  }

  let code: `0x${string}` | undefined
  let plan: ClaimPlan
  try {
    const gasPrice = await publicClient.getGasPrice()
    ;[code, plan] = await Promise.all([publicClient.getCode({ address: to }), planClaim(token, to, from, gasPrice)])
  } catch (error) {
    console.error("faucet rpc failed", error)
    return fail(502, "network_error", "Could not reach BOT Chain testnet. Try again in a minute.")
  }

  if (code && code !== "0x") {
    return fail(400, "contract_address", "That address is a smart contract, not a wallet you control.")
  }
  if (plan.recipientBalance >= plan.amount) {
    return fail(409, "has_balance", `This wallet already holds at least ${plan.label} ${plan.symbol}.`)
  }
  if (plan.faucetTokenBalance < plan.amount) {
    return fail(503, "faucet_empty", `The faucet is out of ${plan.symbol} to send.`)
  }
  if (plan.faucetGasBalance < plan.gasCost) {
    return fail(503, "faucet_empty", `The faucet is out of ${testnet.nativeToken} to pay gas with.`)
  }

  try {
    const hash = await plan.send()
    for (const key of keys) lastClaim.set(key, now)
    return Response.json({
      hash,
      url: `${testnet.explorer}/tx/${hash}`,
      to,
      amount: plan.label,
      token: plan.symbol,
    })
  } catch (error) {
    console.error("faucet send failed", error)
    const message = error instanceof Error ? error.message.toLowerCase() : ""
    if (message.includes("insufficient funds")) {
      return fail(503, "faucet_empty", `The faucet is out of ${testnet.nativeToken} to pay gas with.`)
    }
    return fail(502, "send_failed", "The transaction did not go through. Try again in a minute.")
  }
}
