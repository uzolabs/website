import { ArrowRight, ArrowUpRight, HeartHandshake } from "lucide-react"
import Link from "next/link"
import { DonationAddress } from "@/components/donation-address"
import { FaucetForm } from "@/components/faucet-form"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { StatusBadge } from "@/components/status-badge"
import { cooldownHours, donationAddress, faucetAmount, faucetEnabled } from "@/lib/faucet"
import { testnet } from "@/lib/network"
import { faucetHref, pageMetadata, siteHref } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Testnet faucet",
  description: `Claim test ${testnet.nativeToken} for BOT Chain testnet so you can deploy and try contracts without spending real funds.`,
  path: faucetHref,
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
                <FaucetForm amount={faucetAmount} token={testnet.nativeToken} donationAddress={donationAddress} />
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
              href={siteHref("/quickstart#network")}
              className="group mt-6 inline-flex items-center gap-2 rounded-full py-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              Next: add the network
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Reveal>

          {faucetEnabled ? (
            <Reveal delay={0.1} className="glass rounded-3xl p-6 sm:p-8 lg:col-span-2">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                  >
                    <HeartHandshake className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold">Help the next builder</h2>
                    <p className="mt-1 max-w-xl text-muted-foreground">
                      Done testing? Send your unused {testnet.nativeToken} back to the faucet so others can claim. Every
                      top-up keeps it running.
                    </p>
                  </div>
                </div>
                <div className="min-w-0 lg:w-[30rem] lg:shrink-0">
                  <DonationAddress address={donationAddress} token={testnet.nativeToken} chainId={testnet.chainId} />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Testnet {testnet.nativeToken} only (chain {testnet.chainId}). Never send mainnet BOT or other tokens
                    here.
                  </p>
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>
    </>
  )
}
