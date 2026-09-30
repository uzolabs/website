import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { Reveal } from "@/components/reveal"
import { Section } from "@/components/section"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mainnet, networks, testnet, type Network } from "@/lib/network"

type Field = {
  label: string
  value: (n: Network) => string | number | undefined
  kind: "text" | "copy" | "link" | "faucet"
}

const fields: Field[] = [
  { label: "Chain ID", value: (n) => n.chainId, kind: "copy" },
  { label: "RPC", value: (n) => n.rpc, kind: "copy" },
  { label: "Explorer", value: (n) => n.explorer, kind: "link" },
  { label: "Native token", value: (n) => n.nativeToken, kind: "text" },
  { label: "Faucet", value: (n) => n.faucet, kind: "faucet" },
]

const networkLabel = (n: Network) => (n.key === "mainnet" ? "Mainnet" : "Testnet")

function Value({ field, network }: { field: Field; network: Network }) {
  const raw = field.value(network)
  if (raw === undefined) {
    return <span className="text-muted-foreground">None</span>
  }
  const value = String(raw)
  const copyLabel = `${networkLabel(network)} ${field.label}`

  // Point builders at the Uzo faucet page; it links to the official faucet as a fallback.
  if (field.kind === "faucet") {
    return (
      <Link
        href="/faucet"
        className="inline-flex items-center gap-1 rounded-sm font-medium underline-offset-4 hover:text-primary hover:underline"
      >
        Claim {network.nativeToken}
        <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
      </Link>
    )
  }

  if (field.kind === "link") {
    return (
      <span className="flex min-w-0 items-center gap-1">
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-w-0 items-center gap-1 rounded-sm font-mono text-[0.9rem] break-all underline-offset-4 hover:text-primary hover:underline"
        >
          {value}
          <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </a>
        <CopyButton value={value} label={copyLabel} />
      </span>
    )
  }

  if (field.kind === "copy") {
    return (
      <span className="flex min-w-0 items-center gap-1">
        <span className="font-mono text-[0.9rem] break-all">{value}</span>
        <CopyButton value={value} label={copyLabel} />
      </span>
    )
  }

  return <span className="font-mono text-[0.9rem]">{value}</span>
}

/** Mainnet and testnet details: a table from sm up, one card per network on phones. */
export function NetworkReference() {
  return (
    <>
      {/* Desktop and tablet: one table. */}
      <Reveal className="glass-strong hidden overflow-hidden rounded-3xl sm:block">
        <Table>
          <TableHeader>
            <TableRow className="border-glass-border hover:bg-transparent">
              <TableHead className="h-14 pl-6 text-muted-foreground">
                <span className="sr-only">Field</span>
              </TableHead>
              <TableHead className="h-14 text-base font-bold text-foreground">Mainnet</TableHead>
              <TableHead className="h-14 pr-6 text-base font-bold text-foreground">Testnet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.label} className="border-glass-border hover:bg-foreground/[0.03]">
                <TableHead
                  scope="row"
                  className="h-auto py-4 pl-6 align-middle text-[0.95rem] font-medium text-muted-foreground"
                >
                  {field.label}
                </TableHead>
                <TableCell className="py-3 whitespace-normal">
                  <Value field={field} network={mainnet} />
                </TableCell>
                <TableCell className="py-3 pr-6 whitespace-normal">
                  <Value field={field} network={testnet} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Reveal>

      {/* Phones: one card per network so nothing scrolls sideways. */}
      <div className="grid gap-4 sm:hidden">
        {networks.map((network) => (
          <Reveal key={network.key} className="glass-strong rounded-2xl p-5">
            <h3 className="text-lg font-bold">{networkLabel(network)}</h3>
            <dl className="mt-3 divide-y divide-glass-border">
              {fields.map((field) => (
                <div key={field.label} className="py-3">
                  <dt className="text-sm text-muted-foreground">{field.label}</dt>
                  <dd className="mt-1">
                    <Value field={field} network={network} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ))}
      </div>
    </>
  )
}

export function NetworkSection() {
  return (
    <Section
      id="network"
      eyebrow="Reference"
      title="BOT Chain at a glance."
      lede="The details you reach for most, in one place. Tap to copy."
    >
      <NetworkReference />
    </Section>
  )
}
