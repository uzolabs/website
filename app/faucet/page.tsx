import { ArrowRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { FaucetForm } from "@/components/faucet-form"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { StatusBadge } from "@/components/status-badge"
import { cooldownHours, faucetAmount, faucetEnabled } from "@/lib/faucet"
import { testnet } from "@/lib/network"
import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Testnet faucet",
  description: `Claim test ${testnet.nativeToken} for BOT Chain testnet so you can deploy and try contracts without spending real funds.`,
  path: "/faucet",
})

const linkClass = "rounded-sm text-foreground underline underline-offset-4 hover:text-primary"

function Bullet() {
  return <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full border border-primary/70" />
}

export default function FaucetPage() {
  return (
    <>
      <PageHeader
        eyebrow="Testnet faucet"
        title={
          <>
            Claim test <span className="text-primary">{testnet.nativeToken}.</span>
          </>
        }
        lede={`Paste the wallet you will deploy from. ${testnet.nativeToken} only works on BOT Chain testnet (chain ${testnet.chainId}) and has no real value.`}
      />

      <section aria-labelledby="claim-title" className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="glass-strong rounded-3xl p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="claim-title" className="text-2xl font-bold">
                Request {testnet.nativeToken}
              </h2>
              {faucetEnabled ? null : <StatusBadge status="In progress" />}
            </div>

            {faucetEnabled ? (
              <div className="mt-6">
                <FaucetForm amount={faucetAmount} token={testnet.nativeToken} />
              </div>
            ) : (
              <p className="mt-4 text-muted-foreground">
                The Uzo faucet is not switched on yet. Until it is, use the{" "}
                <a href={testnet.faucet} target="_blank" rel="noreferrer" className={linkClass}>
                  official BOT Chain faucet
                </a>
                .
              </p>
            )}
          </Reveal>

          <Reveal delay={0.06} className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-bold">Good to know</h2>
            <ul className="mt-4 grid gap-3 text-muted-foreground">
              <li className="flex gap-3">
                <Bullet />
                One claim of {faucetAmount} {testnet.nativeToken} per wallet every {cooldownHours} hours.
              </li>
              <li className="flex gap-3">
                <Bullet />
                Wallets that already hold enough {testnet.nativeToken} are skipped, so there is more for everyone.
              </li>
              <li className="flex gap-3">
                <Bullet />
                <span>
                  Still stuck? The{" "}
                  <a href={testnet.faucet} target="_blank" rel="noreferrer" className={linkClass}>
                    official faucet
                    <ArrowUpRight className="ml-0.5 inline size-3.5" aria-hidden="true" />
                  </a>{" "}
                  is another source.
                </span>
              </li>
            </ul>
            <Link
              href="/quickstart#network"
              className="group mt-6 inline-flex items-center gap-2 rounded-full py-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              Next: add the network
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
