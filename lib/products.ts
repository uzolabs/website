import { Database, LayoutTemplate, Package, Radio, type LucideIcon } from "lucide-react"
import type { Status } from "@/components/status-badge"

export type Product = {
  slug: string
  name: string
  icon: LucideIcon
  status: Status
  /** One line for cards. */
  summary: string
  /** A short paragraph for the products page. */
  detail: string
  includes: string[]
}

export const products: Product[] = [
  {
    slug: "sdk",
    name: "uzo-sdk",
    icon: Package,
    status: "In progress",
    summary: "Chain configs, contract addresses and typed helpers for viem and ethers.",
    detail:
      "One install gives your app the BOT Chain network definitions it needs, so you stop copying chain IDs and RPC URLs between projects.",
    includes: [
      "Mainnet and testnet chain definitions",
      "Known contract addresses, starting with Multicall3",
      "Typed helpers for viem and ethers",
      "Explorer links for transactions and addresses",
    ],
  },
  {
    slug: "templates",
    name: "templates",
    icon: LayoutTemplate,
    status: "In progress",
    summary: "Clone-and-deploy starters: token, NFT, DEX, bridge, gasless app, AI agent.",
    detail:
      "Starter repos that deploy to BOT Chain testnet as written, with the network config, scripts and a small frontend already wired up.",
    includes: ["Token", "NFT", "DEX", "Bridge", "Gasless app", "AI agent"],
  },
  {
    slug: "rpc",
    name: "Uzo RPC",
    icon: Radio,
    status: "Planned",
    summary: "RPC with eth_getLogs and WebSockets enabled.",
    detail:
      "The public mainnet RPC disables eth_getLogs, which breaks event feeds and indexers. Uzo RPC is planned to fill that gap.",
    includes: [
      "eth_getLogs enabled",
      "WebSocket subscriptions",
      "Endpoints for mainnet and testnet",
    ],
  },
  {
    slug: "index",
    name: "Uzo Index",
    icon: Database,
    status: "Planned",
    summary: "Hosted indexing, no node required.",
    detail:
      "Query contract events and history over an API instead of running and syncing your own node and indexer.",
    includes: [
      "Contract event indexing",
      "Historical queries over an API",
      "Designed to pair with Uzo RPC",
    ],
  },
]
