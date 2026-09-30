import Link from "next/link"
import { navLinks, site } from "@/lib/site"

const pages = [...navLinks, { label: "Claim testnet", href: "/faucet" }]

const external = [
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
          <Link href="/" className="rounded-sm font-display text-[1.75rem] leading-none" aria-label="Uzo Labs home">
            {site.name}
          </Link>
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
