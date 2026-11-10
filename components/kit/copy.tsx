"use client"

import { useEffect, useState } from "react"

/** Copies a value and says so in place: the label turns to "Copied" and a live region tells screen readers. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button type="button" className="copy" onClick={copy} aria-label={`Copy ${label}`}>
      {copied ? "Copied" : "Copy"}
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copied` : ""}
      </span>
    </button>
  )
}
