import type { Metadata } from "next"

export const site = {
  name: "Uzo Labs",
  url: "https://uzolabs.xyz",
  title: "Uzo Labs: The developer path for BOT Chain",
  description:
    "SDKs, templates and infrastructure that take developers from zero to shipped on BOT Chain. Built in Lagos.",
  links: {
    github: "https://github.com/uzolabs",
    docs: "https://docs.uzolabs.xyz",
    sdkRepo: "https://github.com/uzolabs/uzo-sdk",
    templatesRepo: "https://github.com/uzolabs/templates",
    docsRepo: "https://github.com/uzolabs/documentation",
    issues: "https://github.com/uzolabs/.github/issues",
    x: "https://x.com/uzolabs",
    npm: "https://www.npmjs.com/package/@uzolabs/sdk",
    email: "mailto:uzolabsxyz@gmail.com",
    productHunt:
      "https://www.producthunt.com/products/uzo-labs?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-uzo-labs",
  },
  productHuntBadge:
    "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1267020&theme=light&t=1790998726597",
} as const

export const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Quickstart", href: "/quickstart" },
  { label: "Roadmap", href: "/roadmap" },
] as const

/** Per-page metadata. Open Graph is rebuilt in full because Next merges it shallowly. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const fullTitle = `${title} | ${site.name}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: site.name,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  }
}
