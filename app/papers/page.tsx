import { Arrow, Art, href } from "@/components/kit/bits"
import { PageHead } from "@/components/kit/page-head"
import { WithCode } from "@/components/kit/with-code"
import { papers } from "@/lib/papers"
import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Papers",
  description:
    "The Uzo litepaper and technical paper: the problem, what Uzo Labs built for BOT Chain developers, how Uzo Deploy keeps users safe, and the measurements behind it.",
  path: "/papers",
})

export default function PapersPage() {
  return (
    <>
      <PageHead
        kicker="Papers"
        title={
          <>
            The thinking <span className="grad">behind the path.</span>
          </>
        }
        lead="Two papers on what Uzo is and why. Start with the litepaper for the short version, or read the technical paper for the measurements and the security argument."
        art="network"
        actions={
          <>
            <a className="btn btn--primary" href={href(papers[0].href)} target="_blank" rel="noreferrer">
              Read the litepaper
              <Arrow />
            </a>
            <a className="btn btn--glass" href={href(papers[1].href)} target="_blank" rel="noreferrer">
              Read the technical paper
            </a>
          </>
        }
        facts={papers.map((p) => ({ label: p.kind, value: `${p.version}, ${p.date}, ${p.pages} pages` }))}
      />

      <section className="section" aria-labelledby="papers-h">
        <div className="wrap">
          <div className="head">
            <p className="label">Download</p>
            <h2 id="papers-h">
              Read them in full. <span className="muted">Both are PDFs.</span>
            </h2>
          </div>
          <div className="grid-2">
            {papers.map((paper) => (
              <article className="card glass" id={paper.slug} key={paper.slug} aria-labelledby={`${paper.slug}-h`}>
                <Art name={paper.art} className="card__art" sizes="132px" />
                <p className="meta">
                  <span>{paper.kind}</span>
                  <span className="mono">{paper.version}</span>
                  <span>{paper.date}</span>
                </p>
                <h3 id={`${paper.slug}-h`}>{paper.title}</h3>
                <p>{paper.summary}</p>
                <ul className="ticks">
                  {paper.covers.map((item) => (
                    <li key={item}>
                      <span>
                        <WithCode text={item} />
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="row">
                  <a className="btn btn--primary" href={href(paper.href)} target="_blank" rel="noreferrer">
                    Open the PDF
                    <Arrow />
                  </a>
                  <a className="btn btn--glass" href={href(paper.href)} download aria-label={`Download the ${paper.kind.toLowerCase()}`}>
                    Download ({paper.size})
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
