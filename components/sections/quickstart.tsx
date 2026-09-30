import Link from "next/link"
import { CodeBlock } from "@/components/code-block"
import { Reveal } from "@/components/reveal"
import { Section } from "@/components/section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { testnet } from "@/lib/network"
import { foundryDeploy, foundrySnippet, hardhatDeploy, hardhatSnippet, viemSnippet } from "@/lib/snippets"

const triggerClass =
  "h-9 flex-none rounded-full px-4 text-[0.95rem] data-active:bg-primary data-active:text-primary-foreground dark:data-active:border-transparent dark:data-active:bg-primary dark:data-active:text-primary-foreground"

/** viem, Hardhat and Foundry configs, highlighted at build time. */
export function QuickstartTabs() {
  return (
    <Reveal className="glass-strong rounded-3xl p-3 sm:p-6">
      <Tabs defaultValue="viem" className="gap-4">
        <TabsList className="h-auto gap-1 rounded-full border border-glass-border bg-foreground/5 p-1">
          <TabsTrigger value="viem" className={triggerClass}>
            viem
          </TabsTrigger>
          <TabsTrigger value="hardhat" className={triggerClass}>
            Hardhat
          </TabsTrigger>
          <TabsTrigger value="foundry" className={triggerClass}>
            Foundry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="viem">
          <CodeBlock code={viemSnippet} lang="ts" filename="chain.ts" />
        </TabsContent>

        <TabsContent value="hardhat" className="grid gap-4">
          <CodeBlock code={hardhatSnippet} lang="ts" filename="hardhat.config.ts" />
          <CodeBlock code={hardhatDeploy} lang="bash" filename="terminal" />
        </TabsContent>

        <TabsContent value="foundry" className="grid gap-4">
          <CodeBlock code={foundrySnippet} lang="toml" filename="foundry.toml" />
          <CodeBlock code={foundryDeploy} lang="bash" filename="terminal" />
        </TabsContent>
      </Tabs>
    </Reveal>
  )
}

export function Quickstart() {
  return (
    <Section
      id="quickstart"
      eyebrow="Quickstart"
      title="Connect in minutes."
      lede={
        <>
          Pick your tool. Every config below points at real endpoints. Claim test {testnet.nativeToken} from the{" "}
          <Link href="/faucet" className="rounded-sm text-foreground underline underline-offset-4 hover:text-primary">
            testnet faucet
          </Link>{" "}
          first.
        </>
      }
      action={{ href: "/quickstart", label: "Full quickstart" }}
    >
      <QuickstartTabs />
    </Section>
  )
}
