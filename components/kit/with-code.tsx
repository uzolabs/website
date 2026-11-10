import { Fragment } from "react"

/** Renders RPC method names and `backticked` names inside plain data strings as inline code. */
export function WithCode({ text }: { text: string }) {
  return text.split(/(eth_\w+|`[^`]+`)/).map((part, i) =>
    /^eth_\w+$/.test(part) || /^`[^`]+`$/.test(part) ? (
      <code key={i} className="inline-code">
        {part.replace(/`/g, "")}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}
