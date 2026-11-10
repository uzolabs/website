// Quickstart words and network rows. Chain facts come from lib/network.ts.
import { explorerName, mainnet, testnet, type Network } from "@/lib/network"

export const quickstartSteps = [
  { id: "claim", label: `Claim test ${testnet.nativeToken}` },
  { id: "network", label: "Add the network" },
  { id: "configure", label: "Configure your tool" },
  { id: "verify", label: `Find it on ${explorerName}` },
]

export type NetworkRow = { label: string; value: string; copy?: boolean; link?: string }

const short = (url: string) => url.replace("https://", "")

/** The values a wallet or a tool asks for, in the order it asks. */
export function networkValues(n: Network): NetworkRow[] {
  return [
    { label: "Chain ID", value: String(n.chainId), copy: true },
    { label: "RPC", value: n.rpc, copy: true },
    { label: "Explorer", value: short(n.explorer), link: n.explorer },
    { label: "Token", value: n.nativeToken },
  ]
}

export const quickstartNetworks = [
  { title: "BOT Chain testnet", network: testnet },
  { title: "BOT Chain mainnet", network: mainnet },
]
