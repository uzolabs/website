import { CopyButton } from "@/components/copy-button"
import { highlight, type Lang } from "@/lib/highlight"
import { cn } from "@/lib/utils"

type CodeBlockProps = {
  code: string
  lang: Lang
  filename: string
  className?: string
}

/** Highlighted at build time on the server, so no Shiki code ships to the browser. */
export async function CodeBlock({ code, lang, filename, className }: CodeBlockProps) {
  const html = await highlight(code.trimEnd(), lang)

  return (
    <figure className={cn("overflow-hidden rounded-2xl border border-glass-border bg-[#100e0c]/80", className)}>
      <figcaption className="flex h-11 items-center justify-between border-b border-glass-border pr-2 pl-4">
        <span className="font-mono text-sm text-muted-foreground">{filename}</span>
        <CopyButton value={code.trimEnd()} label={filename} />
      </figcaption>
      <div
        tabIndex={0}
        role="region"
        aria-label={`${filename} code`}
        className="code-block overflow-x-auto p-4 font-mono text-[0.85rem] leading-relaxed sm:p-5 sm:text-sm"
        // Shiki output is generated from our own static snippets.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
