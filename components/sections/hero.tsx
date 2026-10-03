"use client"

import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { easeOut } from "@/components/reveal"
import { GitHubIcon } from "@/components/brand-icons"
import { StatusBadge } from "@/components/status-badge"
import { HeroSpiral } from "@/components/uli/spiral"
import { Button } from "@/components/ui/button"
import { installCommand, sdkVersion } from "@/lib/network"
import { site } from "@/lib/site"

export function Hero() {
  const reduce = useReducedMotion()
  // Same initial markup on server and client; reduced motion only zeroes the duration.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.45, delay, ease: easeOut },
  })

  return (
    <section aria-labelledby="hero-title" className="relative overflow-x-clip">
      <HeroSpiral className="pointer-events-none absolute top-[-4rem] right-[-22rem] w-[46rem] max-w-none sm:right-[-16rem] sm:w-[54rem] lg:top-[-6rem] lg:right-[-10rem] lg:w-[60rem]" />

      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:pt-28 lg:pb-32">
        <motion.h1
          {...rise(0.08)}
          id="hero-title"
          className="max-w-4xl font-display text-[2.75rem] leading-[1.08] tracking-tight text-balance sm:text-[3.5rem] lg:text-[5.25rem] lg:leading-[1.04]"
        >
          The developer path <span className="text-primary">for BOT Chain.</span>
        </motion.h1>

        <motion.p {...rise(0.16)} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          <span className="text-foreground">BOT Chain has the pieces. Uzo is the path.</span> SDKs, templates and
          infrastructure that take you from zero to shipped.
        </motion.p>

        <motion.div {...rise(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            asChild
            className="h-12 rounded-full px-7 text-base font-medium shadow-[0_0_0_0_rgba(217,164,65,0)] transition-shadow hover:bg-primary hover:shadow-[0_0_32px_-4px_rgba(217,164,65,0.55)]"
          >
            <Link href="/quickstart">
              Start building
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="glass h-12 rounded-full px-7 text-base font-medium hover:bg-foreground/10 hover:shadow-[0_0_32px_-6px_rgba(178,58,42,0.5)]"
          >
            <a href={site.links.github} target="_blank" rel="noreferrer">
              <GitHubIcon className="size-4" />
              View on GitHub
            </a>
          </Button>
        </motion.div>

        <motion.div {...rise(0.32)} className="glass-strong mt-12 max-w-md rounded-2xl">
          <div className="flex items-center justify-between border-b border-glass-border px-4 py-2.5">
            <span className="text-sm text-muted-foreground">Install the SDK</span>
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">v{sdkVersion}</span>
              <StatusBadge status="Available" />
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 py-3 pr-2.5 pl-4">
            <code className="overflow-x-auto font-mono text-[0.95rem] whitespace-nowrap">
              <span className="text-primary select-none" aria-hidden="true">
                ${" "}
              </span>
              {installCommand}
            </code>
            <CopyButton value={installCommand} label="install command" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
