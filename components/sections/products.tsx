import Link from "next/link"
import { WithCode } from "@/components/inline-code"
import { Reveal } from "@/components/reveal"
import { Section } from "@/components/section"
import { StatusBadge } from "@/components/status-badge"
import { UliCrescent } from "@/components/uli/crescent"
import { products } from "@/lib/products"

/** Card grid. Each card links to its detail block on /products. */
export function ProductGrid() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {products.map(({ slug, name, icon: Icon, status, summary }, i) => (
        <Reveal
          as="li"
          key={slug}
          delay={(i % 2) * 0.06}
          className="glass group relative overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-[0_0_48px_-12px_rgba(217,164,65,0.35)]"
        >
          <Link href={`/products#${slug}`} className="block h-full rounded-2xl p-6 sm:p-8">
            <UliCrescent className="absolute -top-1 -right-1 size-16 text-primary/30 transition-colors duration-300 group-hover:text-primary/55" />
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full border border-glass-border bg-foreground/5 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <StatusBadge status={status} />
            </div>
            <h3 className="mt-5 font-mono text-xl font-medium">{name}</h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              <WithCode text={summary} />
            </p>
          </Link>
        </Reveal>
      ))}
    </ul>
  )
}

export function Products() {
  return (
    <Section
      id="products"
      eyebrow="What we're building"
      title="Four tools, one path."
      lede="Start with configs and templates today. Hosted infrastructure follows once the basics are solid."
      action={{ href: "/products", label: "Explore products" }}
    >
      <ProductGrid />
    </Section>
  )
}
