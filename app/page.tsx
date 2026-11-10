import Image from "next/image"
import { Arrow, Art, external, href } from "@/components/kit/bits"
import { CopyButton } from "@/components/kit/copy"
import { StatusBadge } from "@/components/kit/status"
import { WithCode } from "@/components/kit/with-code"
import { art, productArt } from "@/lib/art"
import {
  deployHead,
  deploySteps,
  faqs,
  faucetLink,
  hero,
  networkHead,
  networkRows,
  sdkHead,
  sdkModules,
} from "@/lib/home"
import { installCommand, mainnet } from "@/lib/network"
import { products } from "@/lib/products"
import { phases } from "@/lib/roadmap"

/** Lights the last words of a heading with the gradient. */
function Lit({ text, words }: { text: string; words: string }) {
  if (!text.endsWith(words)) return <>{text}</>
  return (
    <>
      {text.slice(0, -words.length)}
      <span className="grad">{words}</span>
    </>
  )
}

const shipping = products.filter((p) => p.status !== "Planned")
const planned = products.filter((p) => p.status === "Planned")

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-h">
        <div className="wrap hero__grid">
          <div className="hero__text">
            <p className="eyebrow reveal">{hero.kicker}</p>
            <h1 id="hero-h" className="reveal reveal-2">
              <Lit text={hero.title} words="BOT Chain" />
            </h1>
            <p className="lead reveal reveal-3">{hero.lead}</p>
            <div className="row reveal reveal-4">
              <a className="btn btn--primary" href={hero.primary.href} {...external(hero.primary.href)}>
                {hero.primary.label}
                <Arrow />
              </a>
              <a className="btn btn--glass" href={href(hero.secondary.href)}>
                {hero.secondary.label}
              </a>
            </div>
            <p className="cmd reveal reveal-4">
              <code>{installCommand}</code>
              <CopyButton value={installCommand} label="install command" />
            </p>
          </div>
          <div className="hero__art reveal reveal-2">
            <Art name="hero" priority sizes="(max-width: 860px) 90vw, 600px" />
            <div className="chip chip--a glass">
              <strong>{hero.float.title}</strong>
              <span>
                {hero.float.step} · {hero.float.note}
              </span>
            </div>
            <div className="chip chip--b glass">
              <strong>BOT Chain mainnet</strong>
              <span>chain {mainnet.chainId}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="products" aria-labelledby="products-h">
        <div className="wrap">
          <div className="head head--split">
            <div className="stack">
              <p className="label">Products</p>
              <h2 id="products-h">
                Five tools. <span className="muted">One path to shipped.</span>
              </h2>
            </div>
            <a className="link" href={href("/products")}>
              All products
              <Arrow />
            </a>
          </div>
          <div className="grid-3">
            {shipping.map((p) => (
              <a key={p.slug} className="card glass" href={href(`/products#${p.slug}`)}>
                <Art name={p.slug as "deploy"} className="card__art" sizes="132px" />
                <div className="meta">
                  <StatusBadge status={p.status} />
                  {p.version ? <span className="mono">{p.version}</span> : null}
                </div>
                <h3>{p.name}</h3>
                <p>
                  <WithCode text={p.summary} />
                </p>
              </a>
            ))}
          </div>
          <div className="grid-2" style={{ marginTop: 18 }}>
            {planned.map((p) => (
              <a key={p.slug} className="card card--planned glass" href={href(`/products#${p.slug}`)}>
                {productArt[p.slug] ? <Art name={p.slug as "rpc"} className="card__art" sizes="132px" /> : null}
                <div className="meta">
                  <StatusBadge status={p.status} />
                </div>
                <h3>{p.name}</h3>
                <p>
                  <WithCode text={p.summary} />
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="sdk" aria-labelledby="sdk-h">
        <div className="wrap split">
          <div className="stack">
            <div className="head" style={{ marginBottom: 8 }}>
              <h2 id="sdk-h">
                {sdkHead.title} <span className="muted">{sdkHead.muted}</span>
              </h2>
              <p className="lead">{sdkHead.lead}</p>
            </div>
            <ul className="rows glass">
              {sdkModules.map((m) => (
                <li key={m.path}>
                  <span className="rows__name mono">{m.path}</span>
                  <span className="rows__value">
                    <StatusBadge status={m.status} note={m.note} />
                  </span>
                  <p className="muted">{m.line}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="stack">
            <div className="code-window glass">
              <div className="code-window__bar">
                <span className="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                client.ts
              </div>
              <pre>
                <code>
                  <span className="tk-k">import</span> {"{ createPublicClient, http }"} <span className="tk-k">from</span>{" "}
                  <span className="tk-s">&apos;viem&apos;</span>
                  {"\n"}
                  <span className="tk-k">import</span> {"{ botChain }"} <span className="tk-k">from</span>{" "}
                  <span className="tk-s">&apos;@uzolabs/sdk/chains&apos;</span>
                  {"\n\n"}
                  <span className="tk-k">const</span> client = <span className="tk-f">createPublicClient</span>({"{"}
                  {"\n"}
                  {"  "}chain: botChain,
                  {"\n"}
                  {"  "}transport: <span className="tk-f">http</span>(),
                  {"\n"}
                  {"})"}
                  {"\n\n"}
                  <span className="tk-c">{"// Reads the latest block from BOT Chain mainnet."}</span>
                  {"\n"}
                  <span className="tk-k">const</span> block = <span className="tk-k">await</span> client.
                  <span className="tk-f">getBlockNumber</span>()
                </code>
              </pre>
            </div>
            <p className="cmd">
              <code>{installCommand}</code>
              <CopyButton value={installCommand} label="install command" />
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="deploy" aria-labelledby="deploy-h">
        <div className="wrap split">
          <div className="stack">
            <div className="head" style={{ marginBottom: 8 }}>
              <h2 id="deploy-h">
                {deployHead.title} <span className="muted">{deployHead.muted}</span>
              </h2>
              <p className="lead">{deployHead.lead}</p>
            </div>
            <ol className="steps">
              {deploySteps.map((step) => (
                <li key={step.name} className="glass">
                  <h3>{step.name}</h3>
                  <p>{step.line}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="shot glass">
            <Image
              src="/img/deploy-token-wide.webp"
              alt="Uzo Deploy with the Token template open: the form on the left and the deploy summary on the right"
              width={1400}
              height={805}
              sizes="(max-width: 860px) 92vw, 600px"
            />
          </div>
        </div>
      </section>

      <section className="section" id="network" aria-labelledby="network-h">
        <Image
          src={art.ribbon.src}
          width={art.ribbon.width}
          height={art.ribbon.height}
          alt=""
          aria-hidden="true"
          className="ribbon ribbon--top"
          sizes="140vw"
        />
        <div className="wrap">
          <div className="head head--split">
            <h2 id="network-h">
              {networkHead.title} <span className="muted">{networkHead.muted}</span>
            </h2>
            <a className="btn btn--primary" href={href(faucetLink.href)} {...external(faucetLink.href)}>
              {faucetLink.label}
              <Arrow />
            </a>
          </div>
          <div className="grid-2">
            {(
              [
                ["BOT Chain mainnet", "main"],
                ["BOT Chain testnet", "test"],
              ] as const
            ).map(([title, key]) => (
              <div className="net-card glass" key={key}>
                <header>
                  <h3>{title}</h3>
                  <span className={`badge${key === "test" ? " is-progress" : ""}`}>{key === "main" ? "Mainnet" : "Testnet"}</span>
                </header>
                <ul className="rows">
                  {networkRows.map((row) => (
                    <li key={row.label}>
                      <span className="rows__name muted">{row.label}</span>
                      <span className="rows__value mono">{row[key]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="roadmap" aria-labelledby="roadmap-h">
        <div className="wrap">
          <div className="head head--split">
            <h2 id="roadmap-h">
              Four phases. <span className="muted">Lit squares have shipped.</span>
            </h2>
            <a className="link" href={href("/roadmap")}>
              See the roadmap
              <Arrow />
            </a>
          </div>
          <div className="grid-4">
            {phases.map((phase, i) => {
              const done = phase.items.filter((item) => item.shipped).length
              return (
                <article className="phase glass" key={phase.title}>
                  <p className="label">Phase {i + 1}</p>
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
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section" id="faq" aria-labelledby="faq-h">
        <div className="wrap split split--top">
          <div className="head">
            <h2 id="faq-h">Questions</h2>
            <p className="lead">Straight answers about cost, keys and what is ready today.</p>
          </div>
          <div className="faq">
            {faqs.map((item) => (
              <details className="glass" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
