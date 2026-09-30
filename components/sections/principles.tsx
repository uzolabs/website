import { Reveal } from "@/components/reveal"
import { Section } from "@/components/section"

const principles = [
  {
    title: "Ship what works",
    body: "Snippets and templates should run on BOT Chain as written. If one does not, that is a bug we fix.",
  },
  {
    title: "Honest status",
    body: "In progress means in progress. Nothing is called live until you can use it today.",
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

/** No glass here on purpose: keeps the blur budget for the panels that need it. */
export function Principles() {
  return (
    <Section id="principles" eyebrow="Principles" title="How we walk it.">
      <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {principles.map((p, i) => (
          <Reveal as="li" key={p.title} delay={(i % 2) * 0.06} className="border-t border-primary/35 pt-5">
            <h3 className="text-xl font-bold">{p.title}</h3>
            <p className="mt-2 max-w-md text-muted-foreground">{p.body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
