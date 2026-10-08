import { cn } from "@/lib/utils"

/** Small gold "New" tag for whatever shipped most recently. */
export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none rounded-full bg-primary px-1.5 py-px text-[0.6rem] leading-none font-bold tracking-wide text-primary-foreground uppercase",
        className,
      )}
    >
      New
    </span>
  )
}
