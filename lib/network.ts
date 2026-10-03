// Single source of truth for BOT Chain network data. Every section reads from here.

export type Network = {
  key: "mainnet" | "testnet"
  name: string
  chainId: number
  rpc: string
  explorer: string
  nativeToken: string
  faucet?: string
}

export const mainnet: Network = {
  key: "mainnet",
  name: "BOT Chain",
  chainId: 677,
  rpc: "https://rpc.botchain.ai",
  explorer: "https://scan.botchain.ai",
  nativeToken: "BOT",
}

export const testnet: Network = {
  key: "testnet",
  name: "BOT Chain Testnet",
  chainId: 968,
  rpc: "https://rpc.bohr.life",
  explorer: "https://scan.bohr.life",
  nativeToken: "tBOT",
  faucet: "https://faucet.botchain.ai/basic",
}

export const networks = [mainnet, testnet] as const

export const contracts = {
  multicall3: "0x47FA21f684bBAD707A53a0f9BE59F1422F46C265",
} as const

export const explorerName = "BOTScan"

export const sdkPackage = "@uzolabs/sdk"
export const sdkVersion = "0.2.0"
export const installCommand = `npm i ${sdkPackage} viem`
