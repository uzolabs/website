import { ArrowRight, ArrowUpRight, Droplets } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { Section } from "@/components/section"
import { Cta } from "@/components/sections/cta"
import { NetworkReference } from "@/components/sections/network"
import { QuickstartTabs } from "@/components/sections/quickstart"
import { Button } from "@/components/ui/button"
import { UliZigzag } from "@/components/uli/zigzag"
import { explorerName, testnet } from "@/lib/network"
import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Quickstart",
  description: `Claim test ${testnet.nativeToken}, add BOT Chain to viem, Hardhat or Foundry, and deploy your first contract to testnet.`,
  path: "/quickstart",
})

const primary =
  "h-12 rounded-full px-7 text-base font-medium hover:bg-primary hover:shadow-[0_0_32px_-4px_rgba(217,164,65,0.55)]"
const outline =
  "glass h-12 rounded-full px-7 text-base font-medium hover:bg-foreground/10 hover:shadow-[0_0_32px_-6px_rgba(178,58,42,0.5)]"

const steps = [
  { href: "#claim", label: `Claim test ${testnet.nativeToken}` },
  { href: "#network", label: "Add the network" },
  { href: "#configure", label: "Configure your tool" },
  { href: "#verify", label: `Find it on ${explorerName}` },
]

export default function QuickstartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Quickstart"
        title={
          <>
            Zero to deployed, <span className="text-primary">on testnet.</span>
          </>
        }
        lede="Four steps from an empty folder to a contract you can see on the explorer. Every config on this page points at real endpoints."
      >
        <nav aria-label="Quickstart steps">
          <ol className="flex flex-wrap gap-2">
            {steps.map((step, i) => (
              <li key={step.href}>
                <a
                  href={step.href}
                  className="glass inline-flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-[0.95rem] hover:bg-foreground/10"
                >
                  <span className="flex size-7 items-center justify-center rounded-full border border-primary/60 font-mono text-sm text-primary">
                    {i + 1}
                  </span>
                  {step.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHeader>

      <Section
        id="claim"
        eyebrow="Step 1"
        title={`Claim test ${testnet.nativeToken}.`}
        lede={`Deploying costs gas, even on testnet. Grab a little ${testnet.nativeToken} for the wallet you will deploy from.`}
      >
        <Reveal className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className={primary}>
            <Link href="/faucet">
              <Droplets className="size-4" aria-hidden="true" />
              Open the faucet
            </Link>
          </Button>
        </Reveal>
      </Section>

      <UliZigzag />

      <Section
        id="network"
        eyebrow="Step 2"
        title="Add the network."
        lede="Everything your wallet and tools need. Tap any value to copy it."
      >
        <NetworkReference />
      </Section>

      <UliZigzag />

      <Section
        id="configure"
        eyebrow="Step 3"
        title="Configure your tool."
        lede="Pick viem for an app, or Hardhat or Foundry for contracts. Each tab ends with the deploy command."
      >
        <QuickstartTabs />
      </Section>

      <UliZigzag />

      <Section
        id="verify"
        eyebrow="Step 4"
        title={`Find it on ${explorerName}.`}
        lede="Copy the contract address from your deploy output and search for it on the testnet explorer. If it is there, you are on the path."
      >
        <Reveal className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className={primary}>
            <a href={testnet.explorer} target="_blank" rel="noreferrer">
              Open {explorerName} testnet
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="outline" className={outline}>
            <Link href="/products#templates">
              Try a template next
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </Section>

      <UliZigzag />
      <Cta />
    </>
  )
}
