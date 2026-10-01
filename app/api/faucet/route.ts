import { getAddress, isAddress, parseEther, type Address } from "viem"
import {
  cooldownHours,
  faucetAddress,
  faucetAmount,
  faucetEnabled,
  publicClient,
  sendTestnetTokens,
} from "@/lib/faucet"
import type { FaucetErrorCode } from "@/lib/faucet-errors"
import { testnet } from "@/lib/network"

// Best effort only: this lives in one function instance's memory, so it resets on cold
// starts and is not shared across instances. Swap for a shared store before a wide launch.
const lastClaim = new Map<string, number>()

// A plain transfer costs 21,000 gas. Pad it so a small price bump does not fail the send.
const transferGas = BigInt(25_000)

function fail(status: number, code: FaucetErrorCode, error: string, extra: Record<string, unknown> = {}) {
  return Response.json({ code, error, ...extra }, { status })
}

export async function POST(request: Request) {
  if (!faucetEnabled) return fail(503, "disabled", "The Uzo faucet is not switched on yet.")

  let address: unknown
  try {
    ;({ address } = await request.json())
  } catch {
    return fail(400, "invalid_address", "Send a JSON body with an address.")
  }
  if (typeof address !== "string" || !isAddress(address.trim(), { strict: false })) {
    return fail(400, "invalid_address", "That does not look like a valid wallet address.")
  }
  const to: Address = getAddress(address.trim())
  const from = faucetAddress()
  if (to === from) return fail(400, "self_address", "That is the faucet's own address.")

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const now = Date.now()
  const windowMs = cooldownHours * 60 * 60 * 1000
  for (const key of [`addr:${to}`, `ip:${ip}`]) {
    const last = lastClaim.get(key)
    if (last && now - last < windowMs) {
      const hours = Math.ceil((windowMs - (now - last)) / 3_600_000)
      return fail(429, "cooldown", `You claimed recently. Try again in about ${hours} hour${hours === 1 ? "" : "s"}.`, {
        retryAfterHours: hours,
      })
    }
  }

  const amount = parseEther(faucetAmount)
  let code: `0x${string}` | undefined
  let balance: bigint
  let faucetBalance: bigint
  let gasPrice: bigint
  try {
    ;[code, balance, faucetBalance, gasPrice] = await Promise.all([
      publicClient.getCode({ address: to }),
      publicClient.getBalance({ address: to }),
      publicClient.getBalance({ address: from }),
      publicClient.getGasPrice(),
    ])
  } catch (error) {
    console.error("faucet rpc failed", error)
    return fail(502, "network_error", "Could not reach BOT Chain testnet. Try again in a minute.")
  }

  if (code && code !== "0x") {
    return fail(400, "contract_address", "That address is a smart contract, not a wallet you control.")
  }
  if (balance >= amount) {
    return fail(409, "has_balance", `This wallet already holds at least ${faucetAmount} ${testnet.nativeToken}.`)
  }
  if (faucetBalance < amount + gasPrice * transferGas) {
    return fail(503, "faucet_empty", `The faucet is out of ${testnet.nativeToken} to send and pay gas with.`)
  }

  try {
    const hash = await sendTestnetTokens(to)
    lastClaim.set(`addr:${to}`, now)
    lastClaim.set(`ip:${ip}`, now)
    return Response.json({ hash, url: `${testnet.explorer}/tx/${hash}`, to, amount: faucetAmount })
  } catch (error) {
    console.error("faucet send failed", error)
    const message = error instanceof Error ? error.message.toLowerCase() : ""
    if (message.includes("insufficient funds")) {
      return fail(503, "faucet_empty", `The faucet is out of ${testnet.nativeToken} to send and pay gas with.`)
    }
    return fail(502, "send_failed", "The transaction did not go through. Try again in a minute.")
  }
}
