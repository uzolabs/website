import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type Status = "In progress" | "Planned"

/** Honest status only. There is deliberately no "Live" variant until something is live. */
export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <Badge
      variant={status === "Planned" ? "outline" : "default"}
      className={cn(
        "h-6 rounded-full px-2.5 text-xs",
        status === "In progress" && "bg-primary/15 text-primary",
        status === "Planned" && "border-foreground/25 text-muted-foreground",
        className
      )}
    >
      {status}
    </Badge>
  )
}
