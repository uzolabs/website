// Server-side faucet logic. Imported only by the route handler and the faucet page.
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  erc20Abi,
  formatEther,
  getAddress,
  http,
  isAddress,
  parseEther,
  type Address,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { contracts, testnet } from "@/lib/network"

export const testnetChain = defineChain({
  id: testnet.chainId,
  name: testnet.name,
  nativeCurrency: { name: testnet.nativeToken, symbol: testnet.nativeToken, decimals: 18 },
  rpcUrls: { default: { http: [testnet.rpc] } },
  blockExplorers: { default: { name: "BOTScan", url: testnet.explorer } },
})

/** Amount sent per claim, in tBOT. Override with FAUCET_AMOUNT. */
export const faucetAmount = process.env.FAUCET_AMOUNT ?? "0.1"

/** Hours between claims for the same wallet or IP. Override with FAUCET_COOLDOWN_HOURS. */
export const cooldownHours = Number(process.env.FAUCET_COOLDOWN_HOURS ?? 24)

/** Where people can send spare tBOT to top the faucet back up. Testnet only. */
export const donationAddress = "0xe3e5D9f7eD994A6b5f697e60218a29F3Bf98B485"

/** The faucet only switches on once a funded testnet key is set. No key, no claims. */
export const faucetEnabled = Boolean(process.env.FAUCET_PRIVATE_KEY)

/** Test USDT: an ERC-20 on testnet that the faucet wallet holds and hands out. Override with FAUCET_USDT_ADDRESS. */
const usdtRaw = process.env.FAUCET_USDT_ADDRESS?.trim() || contracts.testnetUsdt
export const usdtAddress: Address | undefined = usdtRaw && isAddress(usdtRaw) ? getAddress(usdtRaw) : undefined
export const usdtEnabled = faucetEnabled && Boolean(usdtAddress)
/** Matches the contract's own symbol, so it reads the same here and in people's wallets. */
export const usdtSymbol = "USDT"

/** Amount sent per claim, in USDT. Override with FAUCET_USDT_AMOUNT. */
export const usdtAmount = process.env.FAUCET_USDT_AMOUNT ?? "25"

function account() {
  const raw = process.env.FAUCET_PRIVATE_KEY
  if (!raw) throw new Error("FAUCET_PRIVATE_KEY is not set")
  return privateKeyToAccount((raw.startsWith("0x") ? raw : `0x${raw}`) as `0x${string}`)
}

/** The faucet wallet's public address. Only valid when the faucet is enabled. */
export function faucetAddress() {
  return account().address
}

export const publicClient = createPublicClient({ chain: testnetChain, transport: http() })

export async function sendTestnetTokens(to: Address) {
  const wallet = createWalletClient({ account: account(), chain: testnetChain, transport: http() })
  return wallet.sendTransaction({ to, value: parseEther(faucetAmount) })
}

/** Sends test USDT out of the faucet wallet's own balance. `amount` is in base units. */
export async function sendTestUsdt(to: Address, amount: bigint) {
  if (!usdtAddress) throw new Error("FAUCET_USDT_ADDRESS is not set")
  const wallet = createWalletClient({ account: account(), chain: testnetChain, transport: http() })
  return wallet.writeContract({ address: usdtAddress, abi: erc20Abi, functionName: "transfer", args: [to, amount] })
}

export async function faucetBalance() {
  return formatEther(await publicClient.getBalance({ address: account().address }))
}
