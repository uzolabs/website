import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { KitFooter } from "@/components/kit/footer"
import { KitNav } from "@/components/kit/nav"
import { site } from "@/lib/site"
import "./glass.css"

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  // Search Console is verified by DNS; this meta tag is an optional backup.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/img/logo.png`,
  sameAs: [site.links.x, site.links.github, site.links.telegramChannel].filter((href) => href.trim() !== ""),
}

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      {/* Extensions like Grammarly add attributes to body before React loads. */}
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          // Escape "<" so the JSON can never close the script tag early.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        <div className="sky" aria-hidden="true" />
        <KitNav />
        <main id="main">{children}</main>
        <KitFooter />
      </body>
    </html>
  )
}
