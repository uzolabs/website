"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { GitHubIcon } from "@/components/brand-icons"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { navLinks, site, siteHref } from "@/lib/site"
import { cn } from "@/lib/utils"

function Wordmark() {
  return (
    <Link
      href={siteHref("/")}
      className="flex items-center gap-2 rounded-full pr-2 text-foreground"
      aria-label="Uzo Labs home"
    >
      <span className="font-display text-[1.75rem] leading-none">Uzo</span>
    </Link>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6">
      <div className="glass mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full px-3 pl-4 sm:px-4 sm:pl-5">
        <Wordmark />

        <NavigationMenu viewport={false} className="hidden md:flex" aria-label="Main">
          <NavigationMenuList className="gap-1">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  asChild
                  active={isActive(link.href)}
                  className="rounded-full px-3.5 py-2 text-[0.95rem] text-muted-foreground hover:text-foreground data-active:bg-foreground/10 data-active:text-foreground"
                >
                  <Link href={siteHref(link.href)} aria-current={isActive(link.href) ? "page" : undefined}>
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuLink
                href={site.links.docs}
                target="_blank"
                rel="noreferrer"
                className="rounded-full px-3.5 py-2 text-[0.95rem] text-muted-foreground hover:text-foreground"
              >
                Docs
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-full px-3.5 py-2 text-[0.95rem] text-muted-foreground hover:text-foreground"
              >
                GitHub
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden h-10 rounded-full px-5 font-medium sm:inline-flex">
            <a href={site.links.github} target="_blank" rel="noreferrer">
              <GitHubIcon className="size-4" />
              View on GitHub
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="rounded-full md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] border-glass-border bg-[#12100e]/95 p-6 pt-5">
              <SheetTitle className="flex items-center gap-2">
                <span className="font-display text-[1.75rem] leading-none">Uzo</span>
              </SheetTitle>
              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1 text-lg">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={siteHref(link.href)}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-xl px-3 py-3 hover:bg-muted",
                      isActive(link.href) && "bg-foreground/10 text-primary",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href={site.links.docs}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl px-3 py-3 hover:bg-muted"
                >
                  Docs
                </a>
                <a
                  href={site.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl px-3 py-3 hover:bg-muted"
                >
                  GitHub
                </a>
              </nav>
              <Button asChild className="mt-auto h-12 rounded-full text-base font-medium">
                <a href={site.links.github} target="_blank" rel="noreferrer">
                  <GitHubIcon className="size-4" />
                  View on GitHub
                </a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
