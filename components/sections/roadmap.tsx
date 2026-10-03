import { Check } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Section } from "@/components/section"
import { PathLineHorizontal, PathNode, PathSegmentVertical } from "@/components/uli/path-line"
import { phases, type PhaseItem } from "@/lib/roadmap"

type PhaseBodyProps = {
  index: number
  title: string
  summary: string
  items: PhaseItem[]
  detailed?: boolean
}

function PhaseBody({ index, title, summary, items, detailed }: PhaseBodyProps) {
  return (
    <>
      <p className="text-sm font-medium tracking-[0.14em] text-muted-foreground uppercase">Phase {index + 1}</p>
      <h3 className="mt-1 text-xl font-bold">{title}</h3>
      {detailed ? <p className="mt-2 text-muted-foreground">{summary}</p> : null}
      <ul
        className={
          detailed ? "mt-4 grid gap-2 border-t border-glass-border pt-4" : "mt-4 grid gap-2 text-muted-foreground"
        }
      >
        {items.map(({ label, shipped }) => (
          <li key={label} className="flex gap-2.5">
            <span aria-hidden="true" className="flex h-[1.5em] w-4 shrink-0 items-center justify-center">
              {shipped ? (
                <Check className="size-4 text-primary" />
              ) : (
                <span className="size-1.5 rounded-full border border-primary/70" />
              )}
            </span>
            <span>
              {label}
              {shipped ? <span className="sr-only"> (shipped)</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

/** The Uli road: horizontal on desktop, down the left edge on smaller screens. */
export function RoadmapPath({ detailed = false }: { detailed?: boolean }) {
  return (
    <>
      {/* Desktop: a horizontal Uli line runs through all four phases. */}
      <div className="hidden lg:block">
        <div className="relative h-[120px]">
          <PathLineHorizontal className="absolute inset-0" />
          <div className="absolute inset-0 grid grid-cols-4">
            {phases.map((phase, i) => (
              <div key={phase.title} className="flex items-center justify-center">
                <PathNode n={i + 1} />
              </div>
            ))}
          </div>
        </div>
        <ol className="mt-6 grid grid-cols-4">
          {phases.map((phase, i) => (
            <Reveal as="li" key={phase.title} delay={i * 0.08} className="px-2.5">
              <div className="glass h-full rounded-2xl p-6">
                <PhaseBody index={i} {...phase} detailed={detailed} />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* Phones and tablets: the line runs down the left edge. */}
      <ol className="lg:hidden">
        {phases.map((phase, i) => (
          <Reveal as="li" key={phase.title} className="flex gap-4">
            <div className="flex w-10 shrink-0 flex-col items-center">
              <PathNode n={i + 1} />
              {i < phases.length - 1 ? <PathSegmentVertical className="flex-1" /> : null}
            </div>
            <div className="glass mb-6 flex-1 rounded-2xl p-5 sm:p-6">
              <PhaseBody index={i} {...phase} detailed={detailed} />
            </div>
          </Reveal>
        ))}
      </ol>
    </>
  )
}

export function Roadmap() {
  return (
    <Section
      id="roadmap"
      eyebrow="Roadmap"
      title="One road, four stretches."
      lede="Each phase unlocks the next. No dates we cannot keep."
      action={{ href: "/roadmap", label: "View the full roadmap" }}
    >
      <RoadmapPath />
    </Section>
  )
}
