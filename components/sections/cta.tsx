import { MessageSquareWarning } from "lucide-react"
import { GitHubIcon, XIcon } from "@/components/brand-icons"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { UliCrescent } from "@/components/uli/crescent"
import { site } from "@/lib/site"

const outline =
  "glass h-12 rounded-full px-6 text-base font-medium hover:bg-foreground/10 hover:shadow-[0_0_32px_-6px_rgba(178,58,42,0.5)]"

export function Cta() {
  return (
    <section id="get-involved" aria-labelledby="get-involved-title" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="glass-strong relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20">
          <UliCrescent className="absolute top-4 left-4 size-20 -scale-x-100 text-primary/25" />
          <UliCrescent className="absolute right-4 bottom-4 size-20 rotate-180 -scale-x-100 text-primary/25" />
          <p className="text-sm font-medium tracking-[0.14em] text-primary uppercase">Get involved</p>
          <h2
            id="get-involved-title"
            className="mx-auto mt-3 max-w-2xl font-display text-[2.25rem] leading-[1.12] text-balance sm:text-[2.75rem] lg:text-[3rem]"
          >
            Walk the path with us.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Star the repos, try a template, and tell us where BOT Chain tooling still trips you up.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full px-6 text-base font-medium hover:bg-primary hover:shadow-[0_0_32px_-4px_rgba(217,164,65,0.55)]"
            >
              <a href={site.links.github} target="_blank" rel="noreferrer">
                <GitHubIcon className="size-4" />
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline" className={outline}>
              <a href={site.links.x} target="_blank" rel="noreferrer">
                <XIcon className="size-4" />
                Follow on X
              </a>
            </Button>
            <Button asChild variant="outline" className={outline}>
              <a href={site.links.issues} target="_blank" rel="noreferrer">
                <MessageSquareWarning className="size-4" aria-hidden="true" />
                Report a gap
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
