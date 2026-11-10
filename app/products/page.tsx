import { Arrow, Art, external, href } from "@/components/kit/bits"
import { CopyButton } from "@/components/kit/copy"
import { PageHead } from "@/components/kit/page-head"
import { StatusBadge } from "@/components/kit/status"
import { WithCode } from "@/components/kit/with-code"
import type { ArtName } from "@/lib/art"
import { problems, products, type Product } from "@/lib/products"
import { pageMetadata } from "@/lib/site"
import { hasHref } from "@/lib/utils"

export const metadata = pageMetadata({
  title: "Products",
  description:
    "Uzo Deploy, @uzolabs/sdk, starter templates, Uzo RPC and Uzo Index: the tools Uzo Labs builds for BOT Chain developers, with honest status for each.",
  path: "/products",
})

const listTitle = (status: Product["status"]) =>
  status === "Planned" ? "What is planned" : status === "Available" ? "What ships today" : "What it covers"

function Meta({ product }: { product: Product }) {
  return (
    <p className="meta">
      <StatusBadge status={product.status} />
      {product.statusNote ? <span>{product.statusNote}</span> : null}
      {product.version ? <span className="mono">{product.version}</span> : null}
    </p>
  )
}

function Links({ product }: { product: Product }) {
  const links = product.links?.filter(hasHref)
  if (!links?.length) return null
  return (
    <div className="row">
      {links.map((link) =>
        link.primary ? (
          <a key={link.label} className="btn btn--primary" href={link.href} {...external(link.href)}>
            {link.label}
            <Arrow />
          </a>
        ) : (
          <a
            key={link.label}
            className="btn btn--glass"
            href={link.href}
            {...external(link.href)}
            aria-label={`${product.name} on ${link.label}`}
          >
            {link.label}
          </a>
        ),
      )}
    </div>
  )
}

function Lists({ product }: { product: Product }) {
  return (
    <div className="product__aside">
      <h3 className="label">{listTitle(product.status)}</h3>
      <ul className="ticks">
        {product.includes.map((item) => (
          <li key={item}>
            <span><WithCode text={item} /></span>
          </li>
        ))}
      </ul>
      {product.planned ? (
        <>
          <h3 className="label">Coming next</h3>
          <ul className="ticks is-next">
            {product.planned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  )
}

const shipping = products.filter((p) => p.status !== "Planned")
const planned = products.filter((p) => p.status === "Planned")

export default function ProductsPage() {
  return (
    <>
      <PageHead
        kicker="Products"
        title={
          <>
            Five tools, <span className="grad">one path.</span>
          </>
        }
        lead="Uzo Deploy, the SDK and templates are out now because they unblock you today. Hosted infrastructure follows once the basics are solid."
        art="templates"
        actions={
          <a className="btn btn--primary" href={href("/quickstart")}>
            Start building
            <Arrow />
          </a>
        }
        facts={[
          ...shipping.map((p) => ({ label: p.status, value: <a href={`#${p.slug}`}>{p.name}</a> })),
          {
            label: "Planned",
            value: <a href={`#${planned[0]?.slug}`}>{planned.map((p) => p.name).join(" and ")}</a>,
          },
        ]}
      />

      <section className="section" id="problem" aria-labelledby="problem-h">
        <div className="wrap">
          <div className="head">
            <h2 id="problem-h">
              The pieces are there. <span className="muted">The path is not.</span>
            </h2>
            <p className="lead">
              Building on BOT Chain today means stitching things together before you write a line of your app.
            </p>
          </div>
          <ul className="grid-3">
            {problems.map((p, i) => (
              <li key={p.title} className="problem glass">
                <span className="problem__n">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>
                  <WithCode text={p.body} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="shipping-h">
        <div className="wrap">
          <div className="head">
            <p className="label">Available</p>
            <h2 id="shipping-h">
              Out today. <span className="muted">Use them on testnet or mainnet.</span>
            </h2>
          </div>
          {shipping.map((product) => (
            <article
              className="product glass"
              id={product.slug}
              key={product.slug}
              aria-labelledby={`${product.slug}-h`}
            >
              <div className="product__main">
                <div className="product__title">
                  <Art name={product.slug as ArtName} sizes="96px" />
                  <h2 id={`${product.slug}-h`}>{product.name}</h2>
                </div>
                <Meta product={product} />
                <p className="lead">
                  <WithCode text={product.summary} />
                </p>
                <p>
                  <WithCode text={product.detail} />
                </p>
                {product.command ? (
                  <p className="cmd">
                    <code>{product.command}</code>
                    <CopyButton
                      value={product.command}
                      label={product.slug === "sdk" ? "install command" : "clone command"}
                    />
                  </p>
                ) : null}
                <Links product={product} />
              </div>
              <Lists product={product} />
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="planned-h">
        <div className="wrap">
          <div className="head">
            <p className="label">Planned</p>
            <h2 id="planned-h">
              Hosted infrastructure. <span className="muted">Next on the road.</span>
            </h2>
            <p className="lead">These follow once the basics are solid. Neither is available today.</p>
          </div>
          <div className="grid-2">
            {planned.map((product) => (
              <article
                className="card card--planned glass"
                id={product.slug}
                key={product.slug}
                aria-labelledby={`${product.slug}-h`}
              >
                <Art name={product.slug as ArtName} className="card__art" sizes="132px" />
                <Meta product={product} />
                <h3 id={`${product.slug}-h`}>{product.name}</h3>
                <p>
                  <WithCode text={product.detail} />
                </p>
                <ul className="ticks is-next">
                  {product.includes.map((item) => (
                    <li key={item}>
                      <span><WithCode text={item} /></span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
