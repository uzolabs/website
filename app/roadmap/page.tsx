import { PageHeader } from "@/components/page-header"
import { Section } from "@/components/section"
import { Cta } from "@/components/sections/cta"
import { Principles } from "@/components/sections/principles"
import { RoadmapPath } from "@/components/sections/roadmap"
import { UliZigzag } from "@/components/uli/zigzag"
import { site, pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Roadmap",
  description:
    "The four phases of Uzo Labs: fix the path, build the path, get hackathon ready, and run the rails for BOT Chain developers.",
  path: "/roadmap",
})

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Roadmap"
        title={
          <>
            One road, <span className="text-primary">four stretches.</span>
          </>
        }
        lede={
          <>
            Each phase unlocks the next. There are no dates here, because we would rather ship than promise. Follow
            progress on{" "}
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm text-foreground underline underline-offset-4 hover:text-primary"
            >
              GitHub
            </a>
            .
          </>
        }
      />

      <Section
        id="phases"
        eyebrow="The phases"
        title="Where the road goes."
        lede="Basics first, then guides, then templates, then hosted infrastructure."
      >
        <RoadmapPath detailed />
      </Section>

      <UliZigzag />
      <Principles />
      <UliZigzag />
      <Cta />
    </>
  )
}
