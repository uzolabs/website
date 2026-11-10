import type { MetadataRoute } from "next"
import { faucetOnSubdomain, faucetOrigin, site } from "@/lib/site"

// Static route, so this is the build time.
const lastModified = new Date()

/** Pages on this site only. Docs and Deploy publish their own sitemaps. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [url: string, changeFrequency: "weekly" | "monthly"][] = [
    [`${site.url}/`, "weekly"],
    [`${site.url}/products`, "weekly"],
    [`${site.url}/quickstart`, "monthly"],
    [`${site.url}/roadmap`, "monthly"],
    [`${site.url}/papers`, "monthly"],
    [faucetOnSubdomain ? `${faucetOrigin}/` : `${site.url}/faucet`, "monthly"],
  ]
  return pages.map(([url, changeFrequency]) => ({ url, lastModified, changeFrequency }))
}
