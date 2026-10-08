import Link from "next/link"
import type { ComponentType, SVGProps } from "react"
import { TelegramIcon, XIcon } from "@/components/brand-icons"
import { faucetHref, navLinks, site, siteHref } from "@/lib/site"
import { hasHref } from "@/lib/utils"

const pages = [
  ...navLinks.map((link) => ({ label: link.label, href: siteHref(link.href), external: false })),
  { label: "Uzo Deploy", href: site.links.deploy, external: true },
  { label: "Claim testnet", href: faucetHref, external: false },
]

const external = [
  { label: "Docs", href: site.links.docs },
  { label: "GitHub", href: site.links.github },
  { label: "npm", href: site.links.npm },
  { label: "Email", href: site.links.email },
]

const community: { label: string; href: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { label: "Telegram channel", href: site.links.telegramChannel, icon: TelegramIcon },
  { label: "Telegram community", href: site.links.telegramCommunity, icon: TelegramIcon },
  { label: "X", href: site.links.x, icon: XIcon },
].filter(hasHref)

const linkClass = "rounded-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
const headingClass = "text-sm font-medium tracking-[0.14em] text-primary uppercase"

export function Footer() {
  return (
    <footer className="border-t border-glass-border">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:grid-cols-3 sm:px-6 md:grid-cols-[1fr_auto_auto_auto] md:items-start md:gap-8 lg:gap-16">
        <div className="col-span-full md:col-span-1">
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
          <h2 id="footer-site" className={headingClass}>
            Site
          </h2>
          <ul className="mt-4 grid gap-3">
            {pages.filter(hasHref).map((link) => (
              <li key={link.href}>
                {link.external ? (
                  <a href={link.href} target="_blank" rel="noreferrer" className={linkClass}>
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-elsewhere">
          <h2 id="footer-elsewhere" className={headingClass}>
            Elsewhere
          </h2>
          <ul className="mt-4 grid gap-3">
            {external.filter(hasHref).map((link) => (
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

        {community.length > 0 ? (
          <nav aria-labelledby="footer-community">
            <h2 id="footer-community" className={headingClass}>
              Community
            </h2>
            <ul className="mt-4 grid gap-3">
              {community.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" className={`${linkClass} inline-flex items-center gap-2`}>
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="grid gap-2 border-t border-glass-border pt-6 text-sm text-muted-foreground col-span-full">
          <p>
            Built on BOT Chain
            <span aria-hidden="true"> · </span>
            <a href={site.links.botChain} target="_blank" rel="noreferrer" className={linkClass}>
              botchain.ai
            </a>
            <span aria-hidden="true"> · </span>
            <a href={site.links.botScan} target="_blank" rel="noreferrer" className={linkClass}>
              BOTScan
            </a>
          </p>
          <p>{site.name} is an independent project and is not affiliated with or endorsed by BOT Chain.</p>
          <p>
            &copy; {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
