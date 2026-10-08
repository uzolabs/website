export { cn } from "cn"

/** False for links still waiting on a URL, so nothing renders a dead link. */
export const hasHref = <T extends { href: string }>(l: T) => l.href.trim() !== ""
