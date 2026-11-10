"use client"

import { useState, type FormEvent } from "react"
import { Arrow, href } from "@/components/kit/bits"
import { CopyButton } from "@/components/kit/copy"
import { DonationAddress } from "@/components/donation-address"
import { faucetErrors, isFaucetErrorCode, type FaucetErrorCode, type FaucetTokenId } from "@/lib/faucet-errors"
import { testnet } from "@/lib/network"

/** One claimable token. `contract` is set for ERC-20s so people can import them into their wallet. */
export type FaucetTokenOption = { id: FaucetTokenId; symbol: string; amount: string; contract?: string }

type Result =
  | { kind: "ok"; url: string; hash: string; to: string; token: FaucetTokenOption }
  | { kind: "error"; code: FaucetErrorCode; message: string }

type FaucetFormProps = { tokens: FaucetTokenOption[]; donationToken: string; donationAddress: string }

function short(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}

export function FaucetForm({ tokens, donationToken, donationAddress }: FaucetFormProps) {
  const [address, setAddress] = useState("")
  const [tokenId, setTokenId] = useState(tokens[0].id)
  const token = tokens.find((t) => t.id === tokenId) ?? tokens[0]
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setResult(null)
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

  const copy = result?.kind === "error" ? faucetErrors[result.code] : null

  return (
    <div className="stack-5">
      <form onSubmit={onSubmit} className="claim" aria-busy={pending}>
        {tokens.length > 1 ? (
          <fieldset className="claim__tokens">
            <legend>Token</legend>
            {tokens.map((option) => (
              <label key={option.id} className="claim__token">
                <input
                  type="radio"
                  name="token"
                  value={option.id}
                  checked={option.id === tokenId}
                  onChange={() => setTokenId(option.id)}
                />
                {option.symbol}
                <span className="muted">{option.amount} per claim</span>
              </label>
            ))}
          </fieldset>
        ) : null}
        <label className="field">
          Wallet address
          <input
            name="address"
            required
            autoComplete="off"
            spellCheck={false}
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <div className="btn-row">
          <button type="submit" className="btn btn--primary" disabled={pending}>
            {pending ? "Sending..." : `Claim ${token.amount} ${token.symbol}`}
            {pending ? null : <Arrow />}
          </button>
        </div>
      </form>

      <div role="status" aria-live="polite">
        {result?.kind === "ok" ? (
          <div className="claim__result">
            <h3>Claim sent</h3>
            <p>
              {result.token.amount} {result.token.symbol} is on its way to{" "}
              <span className="mono">{short(result.to)}</span>. It usually lands within a few seconds.
            </p>
            <p className="mono">{result.hash}</p>
            {result.token.contract ? (
              <>
                <p className="muted">
                  Not showing in your wallet? Import {result.token.symbol} with this contract address:
                </p>
                <p className="address">
                  <code>{result.token.contract}</code>
                  <CopyButton value={result.token.contract} label={`${result.token.symbol} contract`} />
                </p>
              </>
            ) : null}
            <p className="btn-row">
              <a className="link" href={result.url} target="_blank" rel="noreferrer">
                View on BOTScan
              </a>
              <a className="link" href={href("/quickstart#network")}>
                Next: add the network
              </a>
            </p>
          </div>
        ) : null}

        {result?.kind === "error" && copy ? (
          <div className="claim__result is-error">
            <h3>{copy.title}</h3>
            <p>{result.message}</p>
            {result.message !== copy.hint ? <p className="muted">{copy.hint}</p> : null}
            {copy.donate ? (
              <>
                <p className="muted">Send spare {donationToken} to the faucet:</p>
                <DonationAddress address={donationAddress} token={donationToken} chainId={testnet.chainId} />
              </>
            ) : null}
            {copy.botFaucet ? (
              <p>
                <a className="link" href={testnet.faucet} target="_blank" rel="noreferrer">
                  Open the BOT Chain faucet
                </a>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
