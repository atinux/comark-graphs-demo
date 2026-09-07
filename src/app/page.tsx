import { MarkdownDocument } from "@comark/react"

import { graphComponents } from "@/comark/graph-components"
import { DocView } from "@/components/doc-view"
import { MarkdownSource } from "@/components/markdown-source"
import { readDoc } from "@/lib/content"

/**
 * Parse per request rather than prerendering, so the page is what it claims to
 * be: Comark parsing at runtime, not in a build step. Drop this line and Next
 * will happily bake the figures in at build time instead — the same source
 * works either way, which is the point.
 */
export const dynamic = "force-dynamic"

export default async function ReportPage() {
  // Read and parse on the server. `MarkdownDocument` renders the parsed tree,
  // so the Comark parser never reaches the browser bundle.
  const doc = await readDoc("report")

  return (
    <DocView
      lines={doc.source.split("\n").length}
      rendered={
        <MarkdownDocument
          className="comark-prose"
          components={graphComponents}
          value={doc.document}
        />
      }
      source={<MarkdownSource source={doc.source} />}
    />
  )
}
