// Home page words and lists. Facts come from lib/network.ts and lib/products.ts.
import { explorerName, mainnet, sdkVersion, testnet } from "@/lib/network"
import { faucetHref, site } from "@/lib/site"

export type Status = "Available" | "In progress" | "Planned"

export const hero = {
  kicker: "Uzo Deploy is on mainnet",
  title: "The developer path for BOT Chain",
  lead: `Deploy a verified contract from your browser, or add BOT Chain to your viem app with one install. Mainnet is chain ${mainnet.chainId}.`,
  primary: { label: "Open Uzo Deploy", href: site.links.deploy },
  secondary: { label: "Read the quickstart", href: "/quickstart" },
  image: {
    src: "/img/deploy-token-form.webp",
    alt: "The Uzo Deploy token form: name, symbol and supply fields beside a summary of the deploy",
    width: 1280,
    height: 1327,
  },
  float: { step: "Verify", note: "Step 4 of 4", title: `Verified on ${explorerName} automatically` },
}

/** The SDK's subpaths, with the version each planned one is due in. */
export const sdkModules: { path: string; line: string; status: Status; note?: string }[] = [
  { path: "@uzolabs/sdk/chains", line: "botChain and botChainTestnet for viem", status: "Available" },
  { path: "@uzolabs/sdk/contracts", line: "Addresses and typed ABIs", status: "Available" },
  { path: "@uzolabs/sdk/explorer", line: `A ${explorerName} client with no API key`, status: "Available" },
  { path: "@uzolabs/sdk/bdex", line: "Quotes and swaps on BDEX", status: "Planned", note: "0.3.0" },
  { path: "@uzolabs/sdk/bridge", line: "Bridge helpers", status: "Planned", note: "0.4.0" },
  { path: "@uzolabs/sdk/paymaster", line: "Gasless transactions", status: "Planned", note: "0.5.0" },
]

export const sdkHead = {
  title: "One install for BOT Chain.",
  muted: "Chains, addresses and ABIs for viem.",
  lead: `@uzolabs/sdk v${sdkVersion} defines BOT Chain once so you stop copying chain IDs and RPC URLs. It never touches private keys.`,
}

/** The four steps exactly as Uzo Deploy names them. */
export const deploySteps = [
  { name: "Configure", line: "Pick Token, NFT Collection or Tip Jar and fill in the form." },
  { name: "Review", line: "See the contract, the network and the cost before anything is sent." },
  { name: "Sign", line: "Approve one transaction in your own wallet. Uzo never holds your keys." },
  { name: "Verify", line: `The source is verified on ${explorerName} for you, with a link to the contract.` },
]

export const deployHead = {
  title: "From template to verified contract.",
  muted: "Four steps, one signature.",
  lead: "On mainnet a deploy costs gas plus a 0.1 BOT fee, shown before you sign. Practice first on testnet with free tBOT.",
}

export const networkRows = [
  { label: "Chain ID", main: String(mainnet.chainId), test: String(testnet.chainId) },
  { label: "Token", main: mainnet.nativeToken, test: testnet.nativeToken },
  { label: "RPC", main: mainnet.rpc.replace("https://", ""), test: testnet.rpc.replace("https://", "") },
  { label: "Explorer", main: mainnet.explorer.replace("https://", ""), test: testnet.explorer.replace("https://", "") },
]

export const networkHead = {
  title: "Two networks.",
  muted: "Test on one, ship on the other.",
}

export const faucetLink = { label: "Get test tBOT", href: faucetHref }

export const faqs = [
  {
    q: "What is Uzo Labs?",
    a: "An independent project from Lagos that builds developer tools for BOT Chain: an SDK, starter templates, a browser deploy tool and a testnet faucet.",
  },
  {
    q: "What does a deploy with Uzo Deploy cost?",
    a: "On mainnet you pay network gas plus a fixed 0.1 BOT fee, both shown before you sign. On testnet you pay in tBOT, which is free from the faucet and has no value.",
  },
  {
    q: "Does Uzo hold my keys or my contracts?",
    a: "No. You sign in your own wallet, and Uzo holds no admin keys over anything you deploy.",
  },
  {
    q: "Are the templates ready for real value?",
    a: "They are tested, not audited. Read the code and test on testnet before you put real value behind a contract.",
  },
  {
    q: "Why use the SDK instead of defining the chain myself?",
    a: "You stop copying chain IDs, RPC URLs and contract addresses between projects, and you get typed ABIs and a BOTScan client in the same install.",
  },
  {
    q: "Where do I get test tBOT?",
    a: `From the Uzo Labs faucet or the BOT Chain faucet. Test tokens are for chain ${testnet.chainId} only and have no value.`,
  },
]
