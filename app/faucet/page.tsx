import { Arrow, external, href } from "@/components/kit/bits"
import { PageHead } from "@/components/kit/page-head"
import { StatusBadge } from "@/components/kit/status"
import { DonationAddress } from "@/components/donation-address"
import { FaucetForm, type FaucetTokenOption } from "@/components/faucet-form"
import {
  cooldownHours,
  donationAddress,
  faucetAmount,
  faucetEnabled,
  usdtAddress,
  usdtAmount,
  usdtEnabled,
  usdtSymbol,
} from "@/lib/faucet"
import { testnet } from "@/lib/network"
import { faucetHref, pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Testnet faucet",
  description: `Claim test ${testnet.nativeToken} and test USDT for BOT Chain testnet so you can deploy and try contracts without spending real funds.`,
  path: faucetHref,
})

const tokens: FaucetTokenOption[] = [
  { id: "tbot", symbol: testnet.nativeToken, amount: faucetAmount },
  ...(usdtEnabled ? [{ id: "usdt" as const, symbol: usdtSymbol, amount: usdtAmount, contract: usdtAddress }] : []),
]

/** What people can donate back: whichever tokens the faucet hands out. */
const donationToken = tokens.map((t) => t.symbol).join(" or ")
const many = tokens.length > 1

const notes = [
  usdtEnabled
    ? `One claim of each token per wallet every ${cooldownHours} hours: ${faucetAmount} ${testnet.nativeToken} and ${usdtAmount} ${usdtSymbol}.`
    : `One claim of ${faucetAmount} ${testnet.nativeToken} per wallet every ${cooldownHours} hours.`,
  "Wallets that already hold enough of a token are skipped, so there is more for everyone.",
  ...(usdtEnabled ? [`Moving ${usdtSymbol} costs gas in ${testnet.nativeToken}, so claim some ${testnet.nativeToken} too.`] : []),
]

export default function FaucetPage() {
  return (
    <>
      <PageHead
        kicker="Testnet faucet"
        title={
          <>
            Claim test <span className="grad">{usdtEnabled ? `${testnet.nativeToken} and USDT.` : `${testnet.nativeToken}.`}</span>
          </>
        }
        lead={`Paste the wallet you will deploy from. ${donationToken} only work${many ? "" : "s"} on BOT Chain testnet (chain ${testnet.chainId}) and ${many ? "have" : "has"} no real value.`}
        art="faucet"
        actions={
          <>
            <a className="btn btn--primary" href="#claim">
              Claim test tokens
              <Arrow />
            </a>
            <a className="btn btn--glass" href={href("/quickstart#network")}>
              Add the network
            </a>
          </>
        }
        facts={[
          ...tokens.map((t) => ({ label: t.symbol, value: `${t.amount} per claim` })),
          { label: "Cooldown", value: `${cooldownHours} hours per wallet` },
          { label: "Network", value: `BOT Chain testnet, chain ${testnet.chainId}` },
        ]}
      />

      <section className="section" id="claim" aria-labelledby="claim-h">
        <div className="wrap split split--top">
          <div className="glass panel stack-5">
            <div className="stack-2">
              <h2 id="claim-h">
                Request test tokens. <span className="muted">One wallet, one claim.</span>
              </h2>
              {faucetEnabled ? null : (
                <p className="meta">
                  <StatusBadge status="In progress" />
                </p>
              )}
            </div>
            {faucetEnabled ? (
              <FaucetForm tokens={tokens} donationToken={donationToken} donationAddress={donationAddress} />
            ) : (
              <p className="lead">
                The Uzo faucet is not switched on yet. Until it is, use the{" "}
                <a className="link" href={testnet.faucet} {...external(testnet.faucet ?? "")}>
                  BOT Chain faucet
                </a>
                .
              </p>
            )}
          </div>
          <div className="stack-5">
            <div className="glass panel stack-4">
              <h3>Good to know</h3>
              <ul className="ticks">
                {notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
                <li>
                  <span>
                    Still stuck? The{" "}
                    <a className="link" href={testnet.faucet} {...external(testnet.faucet ?? "")}>
                      BOT Chain faucet
                    </a>{" "}
                    is another source.
                  </span>
                </li>
              </ul>
            </div>
            {faucetEnabled ? (
              <div className="glass panel stack-4 donate" id="donate">
                <h3>Help the next builder</h3>
                <p className="muted">
                  Done testing? Send your unused {donationToken} back so others can claim. Every top-up keeps the faucet
                  running.
                </p>
                <DonationAddress address={donationAddress} token={donationToken} chainId={testnet.chainId} qr />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
