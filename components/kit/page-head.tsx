import type { ReactNode } from "react"
import { Art } from "@/components/kit/bits"
import type { ArtName } from "@/lib/art"

type Fact = { label: string; value: ReactNode }

type PageHeadProps = {
  kicker: string
  title: ReactNode
  lead: ReactNode
  art: ArtName
  actions?: ReactNode
  facts?: Fact[]
}

/** The first screen of an inner page: the words on the left, a floating glass piece on the right, facts below. */
export function PageHead({ kicker, title, lead, art, actions, facts }: PageHeadProps) {
  return (
    <section className="page-head" aria-labelledby="page-h">
      <div className="wrap">
        <div className="page-head__grid">
          <div className="page-head__text">
            <p className="eyebrow reveal">{kicker}</p>
            <h1 id="page-h" className="reveal reveal-2">
              {title}
            </h1>
            <p className="lead reveal reveal-3">{lead}</p>
            {actions ? <div className="row reveal reveal-4">{actions}</div> : null}
          </div>
          <div className="page-head__art reveal reveal-2">
            <Art name={art} priority />
          </div>
        </div>
        {facts ? (
          <dl className="facts">
            {facts.map((fact, i) => (
              <div key={`${fact.label}-${i}`} className="glass">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  )
}
