import { Fragment } from "react"

const codeClass = "rounded-md bg-foreground/10 px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"

/** Renders RPC method names and `backticked` names inside plain data strings as inline code. */
export function WithCode({ text }: { text: string }) {
  return text.split(/(eth_\w+|`[^`]+`)/).map((part, i) =>
    /^eth_\w+$/.test(part) || /^`[^`]+`$/.test(part) ? (
      <code key={i} className={codeClass}>
        {part.replace(/`/g, "")}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}
