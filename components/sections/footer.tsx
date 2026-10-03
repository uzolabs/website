import Link from "next/link"
import { faucetHref, navLinks, site, siteHref } from "@/lib/site"

const pages = [
  ...navLinks.map((link) => ({ label: link.label, href: siteHref(link.href) })),
  { label: "Claim testnet", href: faucetHref },
]

const external = [
  { label: "Docs", href: site.links.docs },
  { label: "GitHub", href: site.links.github },
  { label: "X", href: site.links.x },
  { label: "npm", href: site.links.npm },
  { label: "Email", href: site.links.email },
]

const linkClass = "rounded-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"

export function Footer() {
  return (
    <footer className="border-t border-glass-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto_auto] md:items-start md:gap-16">
        <div>
          <Link
            href={siteHref("/")}
            className="rounded-sm font-display text-[1.75rem] leading-none"
            aria-label="Uzo Labs home"
          >
            {site.name}
          </Link>
          <a
            href={site.links.productHunt}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-fit rounded-lg"
          >
            {/* Product Hunt serves this badge as a live SVG, so it stays a plain img. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Uzo Labs - The Infrastructure Layer for BOT Chain | Product Hunt"
              width={250}
              height={54}
              src={site.productHuntBadge}
            />
          </a>
        </div>

        <nav aria-labelledby="footer-site">
          <h2 id="footer-site" className="text-sm font-medium tracking-[0.14em] text-primary uppercase">
            Site
          </h2>
          <ul className="mt-4 grid gap-3">
            {pages.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-elsewhere">
          <h2 id="footer-elsewhere" className="text-sm font-medium tracking-[0.14em] text-primary uppercase">
            Elsewhere
          </h2>
          <ul className="mt-4 grid gap-3">
            {external.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
                  className={linkClass}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-2 border-t border-glass-border pt-6 text-sm text-muted-foreground md:col-span-3">
          <p>{site.name} is an independent project and is not affiliated with or endorsed by BOT Chain.</p>
          <p>
            &copy; {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
