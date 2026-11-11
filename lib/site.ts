import type { Metadata } from "next"
import type { ArtName } from "@/lib/art"

export const site = {
  name: "Uzo Labs",
  url: "https://uzolabs.xyz",
  title: "Uzo Labs: The developer path for BOT Chain",
  description:
    "SDKs, templates, a browser deploy tool and infrastructure that take developers from zero to shipped on BOT Chain. Built in Lagos.",
  links: {
    github: "https://github.com/uzolabs",
    deploy: "https://deploy.uzolabs.xyz",
    deployRepo: "https://github.com/uzolabs/uzo-deploy",
    telegramChannel: "https://t.me/uzolabs",
    telegramCommunity: "", // TODO(chidile): Telegram community/group invite URL
    botChain: "https://botchain.ai",
    botScan: "https://scan.botchain.ai",
    docs: "https://docs.uzolabs.xyz",
    sdkRepo: "https://github.com/uzolabs/uzo-sdk",
    templatesRepo: "https://github.com/uzolabs/templates",
    docsRepo: "https://github.com/uzolabs/documentation",
    issues: "https://github.com/uzolabs/.github/issues",
    x: "https://x.com/uzolabs",
    npm: "https://www.npmjs.com/package/@uzolabs/sdk",
    email: "mailto:uzolabsxyz@gmail.com",
    productHunt:
      "https://www.producthunt.com/products/uzo-labs?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-uzo-labs",
  },
  productHuntBadge:
    "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1267020&theme=light&t=1790998726597",
} as const

/**
 * The faucet moves to its own host once NEXT_PUBLIC_FAUCET_SUBDOMAIN is "true".
 * Set it for Production only, after faucet.uzolabs.xyz resolves.
 */
export const faucetOnSubdomain = process.env.NEXT_PUBLIC_FAUCET_SUBDOMAIN === "true"
export const faucetOrigin = "https://faucet.uzolabs.xyz"
export const faucetHref = faucetOnSubdomain ? faucetOrigin : "/faucet"

/** Main-site links become absolute while the faucet has its own host, so they leave the subdomain. */
export function siteHref(path: string) {
  return faucetOnSubdomain ? `${site.url}${path}` : path
}

export const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Quickstart", href: "/quickstart" },
  { label: "Roadmap", href: "/roadmap" },
] as const

export type NavLink = { label: string; href: string }

/** The cards under "Products" in the nav, each with its Blender glass piece. */
export const menuCards: { title: string; line: string; href: string; art: ArtName }[] = [
  { title: "Uzo Deploy", line: "Verified contracts from your browser", href: "/products#deploy", art: "deploy" },
  { title: "@uzolabs/sdk", line: "Chains, addresses and ABIs for viem", href: "/products#sdk", art: "sdk" },
  { title: "templates", line: "Clone-and-deploy starter projects", href: "/products#templates", art: "templates" },
]

/** The nav's plain words after "Products". */
export const navWords: NavLink[] = [
  { label: "Quickstart", href: "/quickstart" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Papers", href: "/papers" },
  { label: "Faucet", href: faucetHref },
]

/** The nav's actions: one plain word, then the main button. */
export const navActions = {
  secondary: { label: "Docs", href: site.links.docs },
  primary: { label: "Open Uzo Deploy", href: site.links.deploy },
}

const deployPage = (path: string) => `${site.links.deploy}${path}`
const docsPage = (path: string) => `${site.links.docs}${path}`

/** Footer columns. Empty hrefs are dropped when rendered. */
export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Products",
    links: [
      { label: "Uzo Deploy", href: site.links.deploy },
      { label: "@uzolabs/sdk", href: "/products#sdk" },
      { label: "templates", href: "/products#templates" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Papers", href: "/papers" },
    ],
  },
  {
    title: "Deploy",
    links: [
      { label: "Deploy a token", href: deployPage("/deploy/token") },
      { label: "Deploy an NFT", href: deployPage("/deploy/nft") },
      { label: "Deploy a tip jar", href: deployPage("/deploy/tip-jar") },
      { label: "My contracts", href: deployPage("/my") },
      { label: "Deploy stats", href: deployPage("/stats") },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Docs home", href: site.links.docs },
      { label: "Quickstart guide", href: docsPage("/get-started/quickstart") },
      { label: "How Uzo Deploy works", href: docsPage("/deploy/overview") },
      { label: "Security", href: docsPage("/deploy/security") },
      { label: "Networks and costs", href: docsPage("/deploy/networks-and-costs") },
      { label: "BOT Chain limitations", href: docsPage("/get-started/bot-chain/known-limitations") },
      { label: "Changelog", href: docsPage("/changelog") },
    ],
  },
  {
    title: "Build",
    links: [
      { label: "Quickstart", href: "/quickstart" },
      { label: "Testnet faucet", href: faucetHref },
      { label: "npm", href: site.links.npm },
      { label: "BOTScan", href: site.links.botScan },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Telegram channel", href: site.links.telegramChannel },
      { label: "Telegram community", href: site.links.telegramCommunity },
      { label: "X", href: site.links.x },
      { label: "GitHub", href: site.links.github },
      { label: "Email", href: site.links.email },
      { label: "Report an issue", href: site.links.issues },
    ],
  },
]

/** Per-page metadata. Open Graph is rebuilt in full because Next merges it shallowly. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const fullTitle = `${title} | ${site.name}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: site.name,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  }
}
