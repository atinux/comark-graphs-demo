import type { Metadata } from "next"

import { StreamingDemo } from "@/components/streaming-demo"
import { readDoc } from "@/lib/content"

export const metadata: Metadata = { title: "Streaming" }

export default async function StreamingPage() {
  const doc = await readDoc("streaming")

  return (
    <div>
      <div className="comark-prose mb-12">
        <h1>Streaming</h1>
        <p>
          The same <code>.md</code> file, revealed a few characters at a time,
          re-parsed on every frame. For most of the run the document is
          incomplete — a <code>::graph-table</code> block sits half-written for
          several frames.
        </p>
        <p>
          Comark closes the dangling syntax as it goes, so the prose above never
          reflows into garbage. A component&rsquo;s props live in a{" "}
          <code>---</code> fence that only counts once its closing line arrives,
          which means props are all-or-nothing: in the frames before they land
          the tag has none, and the adapter reserves an empty frame rather than
          rendering a graph with no data.
        </p>
        <p>
          Not everything is covered. A prefix that cuts mid-YAML-key can make
          that fence parse as invalid YAML and <code>parseMarkdown</code> throws
          — about 8% of the prefixes of this file do. Those frames keep the last
          good tree on screen, which is what the counter is reporting.
        </p>
      </div>

      <StreamingDemo source={doc.source} />
    </div>
  )
}
