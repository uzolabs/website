import Image from "next/image"
import { art, type ArtName } from "@/lib/art"
import { siteHref } from "@/lib/site"

/** Site paths become absolute while the faucet runs on its own host. */
export function href(path: string) {
  return path.startsWith("/") ? siteHref(path) : path
}

/** Opens off-site links in a new tab, never mailto. */
export function external(path: string) {
  return /^https?:/.test(path) ? { target: "_blank", rel: "noreferrer" } : {}
}

/** The small arrow that slides on hover. */
export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 7h9M7.5 3.5 11 7l-3.5 3.5" />
    </svg>
  )
}

/** The Uzo Labs spiral, filled with the gold to ember gradient. */
export function Mark() {
  return <span className="mark" style={{ ["--mark" as string]: "url(/img/mark.svg)" }} aria-hidden="true" />
}

/** One of the Blender glass pieces. They are decorative, so screen readers skip them. */
export function Art({
  name,
  className,
  priority,
  sizes = "(max-width: 860px) 70vw, 420px",
}: {
  name: ArtName
  className?: string
  priority?: boolean
  sizes?: string
}) {
  const piece = art[name]
  return (
    <Image
      src={piece.src}
      width={piece.width}
      height={piece.height}
      alt=""
      aria-hidden="true"
      className={className}
      priority={priority}
      sizes={sizes}
    />
  )
}
