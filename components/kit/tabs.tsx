"use client"

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react"

/** Accessible tabs. Panels are rendered on the server and passed in, so only the switching runs here. */
export function Tabs({ label, tabs }: { label: string; tabs: { id: string; label: string; panel: ReactNode }[] }) {
  const [active, setActive] = useState(0)
  const base = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function onKey(e: KeyboardEvent) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (active + step + tabs.length) % tabs.length
    setActive(next)
    refs.current[next]?.focus()
  }

  return (
    <div className="stack">
      <div className="tabs" role="tablist" aria-label={label} onKeyDown={onKey}>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            className="tab"
            role="tab"
            id={`${base}-tab-${tab.id}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          id={`${base}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${tab.id}`}
          hidden={i !== active}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  )
}
