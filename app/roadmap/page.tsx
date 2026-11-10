import { external } from "@/components/kit/bits"
import { PageHead } from "@/components/kit/page-head"
import { phases, principles } from "@/lib/roadmap"
import { pageMetadata, site } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Roadmap",
  description:
    "The four phases of Uzo Labs: fix the path, build the path, get hackathon ready, and run the rails for BOT Chain developers.",
  path: "/roadmap",
})

export default function RoadmapPage() {
  const shipped = phases.flatMap((p) => p.items).filter((item) => item.shipped).length
  const total = phases.flatMap((p) => p.items).length

  return (
    <>
      <PageHead
        kicker="Roadmap"
        title={
          <>
            One road, <span className="grad">four stretches.</span>
          </>
        }
        lead={
          <>
            Each phase builds on the one before. There are no dates here, because we would rather ship than promise. Follow
            progress on{" "}
            <a className="link" href={site.links.github} {...external(site.links.github)}>
              GitHub
            </a>
            .
          </>
        }
        art="roadmap"
        facts={phases.map((phase, i) => ({ label: `Phase ${i + 1}`, value: phase.title }))}
      />

      <section className="section" id="phases" aria-labelledby="phases-h">
        <div className="wrap">
          <div className="head head--split">
            <h2 id="phases-h">
              Where the road goes. <span className="muted">Lit squares have shipped.</span>
            </h2>
            <p className="muted">
              {shipped} of {total} items have shipped.
            </p>
          </div>
          <ol className="grid-2">
            {phases.map((phase, i) => {
              const done = phase.items.filter((item) => item.shipped).length
              return (
                <li key={phase.title} className="phase glass">
                  <p className="label">
                    Phase {i + 1} · {done} of {phase.items.length} shipped
                  </p>
                  <h3>{phase.title}</h3>
                  <p>{phase.summary}</p>
                  <div className="bar" aria-hidden="true">
                    <i style={{ width: `${(done / phase.items.length) * 100}%` }} />
                  </div>
                  <ul className="road">
                    {phase.items.map((item) => (
                      <li key={item.label} className={item.shipped ? "is-done" : undefined}>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="section" id="principles" aria-labelledby="principles-h">
        <div className="wrap">
          <div className="head">
            <h2 id="principles-h">
              How we walk it. <span className="muted">The rules behind every phase.</span>
            </h2>
          </div>
          <ul className="grid-3">
            {principles.map((p, i) => (
              <li key={p.title} className="problem glass">
                <span className="problem__n">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
