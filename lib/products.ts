import { Database, LayoutTemplate, Package, Radio, type LucideIcon } from "lucide-react"
import type { Status } from "@/components/status-badge"
import { installCommand, sdkVersion } from "@/lib/network"
import { site } from "@/lib/site"

export type ProductLink = { label: string; href: string }

export type Product = {
  slug: string
  name: string
  icon: LucideIcon
  status: Status
  /** Shown next to the status, for things that are published. */
  version?: string
  /** One line for cards. */
  summary: string
  /** A short paragraph for the products page. */
  detail: string
  includes: string[]
  /** Items that are announced but not shipped yet. */
  planned?: string[]
  /** A command to copy, like an install or clone. */
  command?: string
  links?: ProductLink[]
}

export const templatesCommand = "npx giget gh:uzolabs/templates/token my-token"

export const products: Product[] = [
  {
    slug: "sdk",
    name: "@uzolabs/sdk",
    icon: Package,
    status: "Available",
    version: `v${sdkVersion}`,
    summary: "Chain definitions, contract addresses, typed ABIs and a BOTScan client, built on viem.",
    detail:
      "One install gives your app the BOT Chain network definitions it needs, so you stop copying chain IDs and RPC URLs between projects. It never touches private keys.",
    includes: [
      "`botChain` and `botChainTestnet` chain definitions for viem",
      "Contract addresses and typed ABIs, including the BDEX V2 router",
      "A BOTScan explorer client with no API key",
      "Typed errors with stable codes",
    ],
    planned: ["BDEX helpers in 0.3.0", "Bridge helpers in 0.4.0", "Paymaster helpers in 0.5.0"],
    command: installCommand,
    links: [
      { label: "npm", href: site.links.npm },
      { label: "GitHub", href: site.links.sdkRepo },
      { label: "Docs", href: site.links.docs },
    ],
  },
  {
    slug: "templates",
    name: "templates",
    icon: LayoutTemplate,
    status: "Available",
    summary: "Clone-and-deploy starters for a token, an NFT, a DEX integration and a gasless app.",
    detail:
      "Starter projects that deploy to BOT Chain testnet as written, with Foundry and Hardhat, deploy scripts and a small React frontend already wired up. They are for learning and have not been audited.",
    includes: [
      "Token: ERC-20 with permit and owner minting",
      "NFT: ERC-721 with on-chain art and a mint page",
      "DEX integration: BDEX quotes, swaps and liquidity",
      "Gasless app: an ERC-2771 forwarder and relayer",
    ],
    planned: ["Bridge integration", "AI agent"],
    command: templatesCommand,
    links: [
      { label: "GitHub", href: site.links.templatesRepo },
      { label: "Docs", href: site.links.docs },
    ],
  },
  {
    slug: "rpc",
    name: "Uzo RPC",
    icon: Radio,
    status: "Planned",
    summary: "RPC with eth_getLogs and WebSockets enabled.",
    detail:
      "The public mainnet RPC disables eth_getLogs, which breaks event feeds and indexers. Uzo RPC is planned to fill that gap.",
    includes: ["eth_getLogs enabled", "WebSocket subscriptions", "Endpoints for mainnet and testnet"],
  },
  {
    slug: "index",
    name: "Uzo Index",
    icon: Database,
    status: "Planned",
    summary: "Hosted indexing, no node required.",
    detail: "Query contract events and history over an API instead of running and syncing your own node and indexer.",
    includes: ["Contract event indexing", "Historical queries over an API", "Designed to pair with Uzo RPC"],
  },
]
