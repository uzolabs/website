import { CopyButton } from "@/components/kit/copy"
import { highlight, type Lang } from "@/lib/highlight"

/** A file of code, highlighted on the server, with its name and a copy button above it. */
export async function CodeBlock({ code, lang, filename }: { code: string; lang: Lang; filename: string }) {
  const source = code.trimEnd()
  const html = await highlight(source, lang)

  return (
    <div className="code">
      <div className="code__bar">
        <span className="code__name">{filename}</span>
        <CopyButton value={source} label={filename} />
      </div>
      <div
        className="code__body"
        tabIndex={0}
        role="region"
        aria-label={`${filename} code`}
        // Shiki output is generated from our own static snippets.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
