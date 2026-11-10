"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Art, external, href, Mark } from "@/components/kit/bits"
import { menuCards, navActions, navWords, site } from "@/lib/site"

/** A floating glass bar. "Products" opens glass cards on hover or focus; on a phone the links fold into a sheet. */
export function KitNav() {
  const pathname = usePathname()
  const [openOn, setOpenOn] = useState<string | null>(null)
  // The sheet closes itself on navigation because it only stays open for the page it was opened on.
  const open = openOn === pathname

  const current = (path: string) => (pathname === path ? "page" : undefined)

  return (
    <header className="nav">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="wrap">
        <div className="nav__bar">
          <a className="logo" href={href("/")}>
            <Mark />
            {site.name}
          </a>
          <nav className="nav__links" aria-label="Main">
            <div className="nav__item">
              <a className="nav__link" href={href("/products")} aria-current={current("/products")}>
                Products
                <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
                  <path
                    d="M3 4.5l3 3 3-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <div className="nav__menu glass">
                {menuCards.map((card) => (
                  <a key={card.title} className="menu-card" href={href(card.href)}>
                    <Art name={card.art} sizes="72px" />
                    <strong>{card.title}</strong>
                    <span>{card.line}</span>
                  </a>
                ))}
              </div>
            </div>
            {navWords.map((word) => (
              <a key={word.label} className="nav__link" href={href(word.href)} aria-current={current(word.href)}>
                {word.label}
              </a>
            ))}
          </nav>
          <div className="nav__actions">
            <a className="nav__link" href={navActions.secondary.href} {...external(navActions.secondary.href)}>
              {navActions.secondary.label}
            </a>
            <a className="btn btn--primary btn--sm" href={navActions.primary.href} {...external(navActions.primary.href)}>
              {navActions.primary.label}
            </a>
            <button
              className="nav__toggle"
              type="button"
              aria-expanded={open}
              aria-controls="nav-sheet"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpenOn(open ? null : pathname)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                {open ? (
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                ) : (
                  <path d="M2 6h14M2 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
        <nav id="nav-sheet" className="sheet glass" aria-label="Mobile" hidden={!open}>
          <a href={href("/products")}>Products</a>
          {navWords.map((word) => (
            <a key={word.label} href={href(word.href)}>
              {word.label}
            </a>
          ))}
          <a href={navActions.secondary.href} {...external(navActions.secondary.href)}>
            {navActions.secondary.label}
          </a>
          <a className="btn btn--primary" href={navActions.primary.href} {...external(navActions.primary.href)}>
            {navActions.primary.label}
          </a>
        </nav>
      </div>
    </header>
  )
}
