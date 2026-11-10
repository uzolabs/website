import type { Status } from "@/lib/home"

/** Honest status only: Available, In progress or Planned. */
export function StatusBadge({ status, note }: { status: Status; note?: string }) {
  const tone = status === "Planned" ? " is-planned" : status === "In progress" ? " is-progress" : ""
  return (
    <span className={`badge${tone}`}>
      {status}
      {note ? ` in ${note}` : ""}
    </span>
  )
}
