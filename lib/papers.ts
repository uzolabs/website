import type { ArtName } from "@/lib/art"

// The Uzo papers. The PDFs live in public/papers; bump the file name with each new version.

export type Paper = {
  slug: string
  title: string
  kind: string
  version: string
  date: string
  pages: number
  size: string
  summary: string
  covers: string[]
  href: string
  art: ArtName
}

export const papers: Paper[] = [
  {
    slug: "litepaper",
    title: "Uzo: The Developer Path for BOT Chain",
    kind: "Litepaper",
    version: "v1.0",
    date: "November 2026",
    pages: 2,
    size: "35 KB",
    summary:
      "The short read. The problem Uzo solves, what we built, how Uzo Deploy keeps you safe and where we are going.",
    covers: [
      "Why BOT Chain is hard to build on today",
      "The SDK, templates, docs, Uzo Deploy and the hackathon kit",
      "How Uzo Deploy keeps your wallet and contracts safe",
      "What comes next and how to get involved",
    ],
    href: "/papers/uzo-litepaper-v1.0.pdf",
    art: "quickstart",
  },
  {
    slug: "technical-paper",
    title: "Uzo: Measuring and Closing the Developer Gap on BOT Chain",
    kind: "Technical paper",
    version: "v1.0",
    date: "November 2026",
    pages: 7,
    size: "76 KB",
    summary:
      "The full detail. A measurement study of BOT Chain's developer surface, the design and security properties of Uzo Deploy, and the architecture of the wider toolkit.",
    covers: [
      "Fees, latency, `eth_getLogs`, verification and test funds, as measured",
      "Uzo Deploy: factories, the fee, templates and automatic verification",
      "Security properties and the tests behind them",
      "The design of Uzo Index, plus limits and future work",
    ],
    href: "/papers/uzo-technical-paper-v1.0.pdf",
    art: "roadmap",
  },
]
