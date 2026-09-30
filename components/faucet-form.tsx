"use client"

import { ArrowUpRight, Droplets, Loader2 } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"

type Result = { kind: "ok"; url: string } | { kind: "error"; message: string } | null

export function FaucetForm({ amount, token }: { amount: string; token: string }) {
  const [address, setAddress] = useState("")
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<Result>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setResult(null)
    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })
      const data = await res.json()
      setResult(res.ok ? { kind: "ok", url: data.url } : { kind: "error", message: data.error })
    } catch {
      setResult({ kind: "error", message: "Could not reach the faucet. Check your connection and try again." })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
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
          pattern="^\s*0x[a-fA-F0-9]{40}\s*$"
          title="A 0x address with 40 hex characters"
          className="h-12 min-w-0 flex-1 rounded-full border border-glass-border bg-[#100e0c]/80 px-5 font-mono text-[0.95rem] outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
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
          Claim {amount} {token}
        </Button>
      </div>

      <div aria-live="polite" className="min-h-6">
        {result?.kind === "ok" ? (
          <p className="text-foreground">
            Sent. It should land within a few seconds.{" "}
            <a
              href={result.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-sm text-primary underline underline-offset-4"
            >
              View the transaction
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </p>
        ) : null}
        {result?.kind === "error" ? <p className="text-[#E8A08C]">{result.message}</p> : null}
      </div>
    </form>
  )
}
