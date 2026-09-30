import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { CopyButton } from "@/components/copy-button"
import { WithCode } from "@/components/inline-code"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { Cta } from "@/components/sections/cta"
import { Problem } from "@/components/sections/problem"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { UliCrescent } from "@/components/uli/crescent"
import { UliZigzag } from "@/components/uli/zigzag"
import { installCommand } from "@/lib/network"
import { products } from "@/lib/products"
import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Products",
  description:
    "uzo-sdk, starter templates, Uzo RPC and Uzo Index: the tools Uzo Labs is building for BOT Chain developers, with honest status for each.",
  path: "/products",
})

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title={
          <>
            Four tools, <span className="text-primary">one path.</span>
          </>
        }
        lede="Configs and templates come first because they unblock you today. Hosted infrastructure follows once the basics are solid."
      >
        <Button
          asChild
          className="h-12 rounded-full px-7 text-base font-medium hover:bg-primary hover:shadow-[0_0_32px_-4px_rgba(217,164,65,0.55)]"
        >
          <Link href="/quickstart">
            Start building
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </PageHeader>

      <section aria-label="Product details" className="py-16 sm:py-24">
        <ul className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6">
          {products.map(({ slug, name, icon: Icon, status, summary, detail, includes }) => (
            <Reveal as="li" key={slug}>
              <article
                id={slug}
                aria-labelledby={`${slug}-title`}
                className="glass relative scroll-mt-28 overflow-hidden rounded-3xl p-6 sm:p-10"
              >
                <UliCrescent className="absolute top-2 right-2 size-20 text-primary/25" />
                <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-full border border-glass-border bg-foreground/5 text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <StatusBadge status={status} />
                    </div>
                    <h2 id={`${slug}-title`} className="mt-5 font-mono text-2xl font-medium sm:text-[1.75rem]">
                      {name}
                    </h2>
                    <p className="mt-3 text-lg text-foreground/90">
                      <WithCode text={summary} />
                    </p>
                    <p className="mt-3 text-muted-foreground">
                      <WithCode text={detail} />
                    </p>
                    {slug === "sdk" ? (
                      <div className="mt-6 flex max-w-md items-center justify-between gap-3 rounded-xl border border-glass-border bg-[#100e0c]/80 py-2 pr-2 pl-4">
                        <code className="overflow-x-auto font-mono text-[0.95rem] whitespace-nowrap">
                          <span className="text-primary select-none" aria-hidden="true">
                            ${" "}
                          </span>
                          {installCommand}
                        </code>
                        <CopyButton value={installCommand} label="install command" />
                      </div>
                    ) : null}
                  </div>

                  <div className="md:border-l md:border-glass-border md:pl-12">
                    <h3 className="text-sm font-medium tracking-[0.14em] text-muted-foreground uppercase">
                      {status === "Planned" ? "What is planned" : "What it covers"}
                    </h3>
                    <ul className="mt-4 grid gap-3">
                      {includes.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] size-1.5 shrink-0 rounded-full border border-primary/70"
                          />
                          <WithCode text={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      <UliZigzag />
      <Problem />
      <UliZigzag />
      <Cta />
    </>
  )
}
