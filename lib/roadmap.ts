export type PhaseItem = {
  label: string
  /** Only true once it is published and anyone can use it. */
  shipped?: boolean
}

export type Phase = {
  title: string
  summary: string
  items: PhaseItem[]
}

export const phases: Phase[] = [
  {
    title: "Fix the path",
    summary: "Get the basics right so every common tool knows BOT Chain exists.",
    items: [
      { label: "SDK chain configs", shipped: true },
      { label: "Network reference", shipped: true },
      { label: "viem and Chainlist contributions" },
    ],
  },
  {
    title: "Build the path",
    summary: "Guides and starters that take a project from an empty folder to a deployed contract.",
    items: [
      { label: "Hardhat and Foundry quickstarts", shipped: true },
      { label: "Contract verification guide", shipped: true },
      { label: "Starter templates", shipped: true },
      { label: "Uzo Deploy: browser deploys with automatic verification", shipped: true },
    ],
  },
  {
    title: "Hackathon ready",
    summary: "Templates for the builds people reach for when the clock is running.",
    items: [
      { label: "AI agent template" },
      { label: "Paymaster tutorial" },
      { label: "Indexer starter" },
      { label: "Agent Vault in Uzo Deploy" },
    ],
  },
  {
    title: "Run the rails",
    summary: "Hosted infrastructure for the gaps public endpoints leave open, like event queries.",
    items: [{ label: "Uzo RPC as a hosted service" }, { label: "Uzo Index as a hosted service" }],
  },
]

/** How Uzo Labs works, shown under the phases on /roadmap. */
export const principles = [
  {
    title: "Ship what works",
    body: "Snippets and templates should run on BOT Chain as written. If one does not, that is a bug we fix.",
  },
  {
    title: "Honest status",
    body: "In progress means in progress. Nothing is called available until you can use it today.",
  },
  {
    title: "Open by default",
    body: "Code and configs live in public repos, and gaps are tracked in the open.",
  },
  {
    title: "BOT Chain first, never BOT Chain only",
    body: "Built for BOT Chain, on standard EVM tooling, so what you learn carries to any chain.",
  },
]
