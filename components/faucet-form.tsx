"use client"

import { ArrowRight, ArrowUpRight, CircleAlert, CircleCheck, Droplets, Loader2, XIcon } from "lucide-react"
import Link from "next/link"
import { Dialog } from "radix-ui"
import { useState, type FormEvent } from "react"
import { DonationAddress } from "@/components/donation-address"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/copy-button"
import { faucetErrors, isFaucetErrorCode, type FaucetErrorCode, type FaucetTokenId } from "@/lib/faucet-errors"
import { testnet } from "@/lib/network"
import { siteHref } from "@/lib/site"
import { cn } from "@/lib/utils"

/** One claimable token. `contract` is set for ERC-20s so people can import them into their wallet. */
export type FaucetTokenOption = { id: FaucetTokenId; symbol: string; amount: string; contract?: string }

type Result =
  | { kind: "ok"; url: string; hash: string; to: string; token: FaucetTokenOption }
  | { kind: "error"; code: FaucetErrorCode; message: string }

type FaucetFormProps = { tokens: FaucetTokenOption[]; donationToken: string; donationAddress: string }

function short(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}

const actionLink =
  "inline-flex items-center gap-1.5 rounded-sm font-medium text-primary underline-offset-4 hover:underline"

export function FaucetForm({ tokens, donationToken, donationAddress }: FaucetFormProps) {
  const [address, setAddress] = useState("")
  const [tokenId, setTokenId] = useState(tokens[0].id)
  const token = tokens.find((t) => t.id === tokenId) ?? tokens[0]
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, token: token.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setResult({ kind: "ok", url: data.url, hash: data.hash, to: data.to ?? address.trim(), token })
      } else {
        const code: FaucetErrorCode = isFaucetErrorCode(data.code) ? data.code : "send_failed"
        setResult({ kind: "error", code, message: data.error ?? faucetErrors[code].hint })
      }
    } catch {
      setResult({ kind: "error", code: "offline", message: faucetErrors.offline.hint })
    } finally {
      setPending(false)
    }
  }

  const ok = result?.kind === "ok"
  const copy = result?.kind === "error" ? faucetErrors[result.code] : null

  return (
    <>
      <form onSubmit={onSubmit} className="grid gap-4">
        {tokens.length > 1 ? (
          <fieldset className="min-w-0">
            <legend className="mb-3 font-medium">Token</legend>
            <div className="flex flex-wrap gap-2">
              {tokens.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                    option.id === tokenId
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-glass-border bg-[#100e0c]/80 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <input
                    type="radio"
                    name="token"
                    value={option.id}
                    checked={option.id === tokenId}
                    onChange={() => setTokenId(option.id)}
                    className="sr-only"
                  />
                  {option.symbol}
                  <span className="font-normal opacity-80">
                    {option.amount} per claim
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
        <label htmlFor="faucet-address" className="font-medium">
          Wallet address
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="faucet-address"
            name="address"
            required
            autoComplete="off"
            spellCheck={false}
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="h-12 w-full min-w-0 rounded-full border border-glass-border bg-[#100e0c]/80 px-5 font-mono text-[0.95rem] outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-1"
          />
          <Button
            type="submit"
            disabled={pending}
            className="h-12 rounded-full px-7 text-base font-medium hover:bg-primary hover:shadow-[0_0_32px_-4px_rgba(217,164,65,0.55)]"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Droplets className="size-4" aria-hidden="true" />
            )}
            {pending ? "Sending..." : `Claim ${token.amount} ${token.symbol}`}
          </Button>
        </div>
      </form>

      <Dialog.Root open={result !== null} onOpenChange={(open) => !open && setResult(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-glass-border bg-popover p-6 text-popover-foreground shadow-2xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:p-8">
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon-sm" className="absolute top-4 right-4 rounded-full max-sm:size-9">
                <XIcon />
                <span className="sr-only">Close</span>
              </Button>
            </Dialog.Close>

            <span
              aria-hidden="true"
              className={
                ok
                  ? "flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary"
                  : "flex size-12 items-center justify-center rounded-full bg-[#E8A08C]/15 text-[#E8A08C]"
              }
            >
              {ok ? <CircleCheck className="size-6" /> : <CircleAlert className="size-6" />}
            </span>

            {result?.kind === "ok" ? (
              <>
                <Dialog.Title className="mt-5 text-xl font-bold">Claim sent</Dialog.Title>
                <Dialog.Description className="mt-2 text-muted-foreground">
                  {result.token.amount} {result.token.symbol} is on its way to{" "}
                  <span className="font-mono text-foreground">{short(result.to)}</span>. It usually lands within a few
                  seconds.
                </Dialog.Description>
                <dl className="mt-5 grid gap-1 rounded-2xl border border-glass-border bg-glass p-4 text-sm">
                  <dt className="text-muted-foreground">Transaction</dt>
                  <dd className="font-mono break-all">{result.hash}</dd>
                </dl>
                {result.token.contract ? (
                  <div className="mt-3 rounded-2xl border border-glass-border bg-glass p-4 text-sm">
                    <p className="text-muted-foreground">
                      Not showing in your wallet? Import the {result.token.symbol} token with this contract address:
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <code className="min-w-0 flex-1 font-mono break-all">{result.token.contract}</code>
                      <CopyButton value={result.token.contract} label={`${result.token.symbol} contract`} />
                    </div>
                  </div>
                ) : null}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <a href={result.url} target="_blank" rel="noreferrer" className={actionLink}>
                    View on BOTScan
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                  <Link href={siteHref("/quickstart#network")} className={actionLink}>
                    Next: add the network
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </>
            ) : null}

            {result?.kind === "error" && copy ? (
              <>
                <Dialog.Title className="mt-5 text-xl font-bold">{copy.title}</Dialog.Title>
                <Dialog.Description className="mt-2 text-foreground">{result.message}</Dialog.Description>
                {result.message !== copy.hint ? <p className="mt-2 text-muted-foreground">{copy.hint}</p> : null}

                {copy.donate ? (
                  <div className="mt-5 rounded-2xl border border-glass-border bg-glass p-4 text-sm">
                    <p className="text-muted-foreground">Send spare {donationToken} to the faucet:</p>
                    <DonationAddress
                      address={donationAddress}
                      token={donationToken}
                      chainId={testnet.chainId}
                      className="mt-2"
                    />
                  </div>
                ) : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {copy.official ? (
                    <a href={testnet.faucet} target="_blank" rel="noreferrer" className={actionLink}>
                      Official BOT Chain faucet
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <span />
                  )}
                  <Dialog.Close asChild>
                    <Button className="h-10 rounded-full px-6">
                      {result.code === "has_balance" ? "Got it" : "Try again"}
                    </Button>
                  </Dialog.Close>
                </div>
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
