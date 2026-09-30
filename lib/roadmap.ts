export type Phase = {
  title: string
  summary: string
  items: string[]
}

export const phases: Phase[] = [
  {
    title: "Fix the path",
    summary: "Get the basics right so every common tool knows BOT Chain exists.",
    items: ["SDK chain configs", "Network reference", "viem and Chainlist contributions"],
  },
  {
    title: "Build the path",
    summary: "Guides and starters that take a project from an empty folder to a deployed contract.",
    items: ["Hardhat and Foundry quickstarts", "Contract verification guide", "Starter templates"],
  },
  {
    title: "Hackathon ready",
    summary: "Templates for the builds people reach for when the clock is running.",
    items: ["AI agent template", "Paymaster tutorial", "Indexer starter"],
  },
  {
    title: "Run the rails",
    summary: "Hosted infrastructure for the gaps public endpoints leave open, like event queries.",
    items: ["Uzo RPC as a hosted service", "Uzo Index as a hosted service"],
  },
]
