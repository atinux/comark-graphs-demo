import { MarkdownDocument } from "@comark/react"

import { graphComponents } from "@/comark/graph-components"
import { DocView } from "@/components/doc-view"
import { MarkdownSource } from "@/components/markdown-source"
import { readDoc } from "@/lib/content"

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
