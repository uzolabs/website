import { FileCog, SearchX, Split, type LucideIcon } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Section } from "@/components/section"

type Problem = { icon: LucideIcon; title: string; body: React.ReactNode }

const problems: Problem[] = [
  {
    icon: Split,
    title: "Scattered setup",
    body: "Network details are spread across many pages, so every new project starts with a hunt.",
  },
  {
    icon: FileCog,
    title: "No ready configs",
    body: "Every builder writes their own chain config for viem, ethers, Hardhat and Foundry.",
  },
  {
    icon: SearchX,
    title: "Blocked event queries",
    body: (
      <>
        <code className="rounded-md bg-foreground/10 px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
          eth_getLogs
        </code>{" "}
        is disabled on the public mainnet RPC, so indexing and event feeds break.
      </>
    ),
  },
]

export function Problem() {
  return (
    <Section
      id="problem"
      eyebrow="The problem"
      title="The pieces are there. The path is not."
      lede="Building on BOT Chain today means stitching things together before you write a line of your app."
    >
      <ul className="grid gap-5 md:grid-cols-3">
        {problems.map(({ icon: Icon, title, body }, i) => (
          <Reveal as="li" key={title} delay={i * 0.06} className="glass rounded-2xl p-6 sm:p-7">
            <span className="flex size-11 items-center justify-center rounded-full border border-glass-border bg-foreground/5 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-bold">{title}</h3>
            <p className="mt-2 text-muted-foreground">{body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
