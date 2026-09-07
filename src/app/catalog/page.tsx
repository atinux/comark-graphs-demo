import type { Metadata } from "next"
import { MarkdownDocument } from "@comark/react"

import { graphComponents } from "@/comark/graph-components"
import { DocView } from "@/components/doc-view"
import { MarkdownSource } from "@/components/markdown-source"
import { readDoc } from "@/lib/content"

export const metadata: Metadata = { title: "Catalog" }

// Parsed per request, same as the report page.
export const dynamic = "force-dynamic"

export default async function CatalogPage() {
  const doc = await readDoc("catalog")

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
