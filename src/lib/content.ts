import { readFile } from "node:fs/promises"
import path from "node:path"

import { parseMarkdown, type MarkdownDocument } from "comark"

const CONTENT_DIR = path.join(process.cwd(), "content")

export type Doc = {
  slug: string
  /** The raw `.md` file, kept so the page can show its own source. */
  source: string
  /** Parsed on the server: `['tag', props, ...children]`, serialisable. */
  document: MarkdownDocument
  frontmatter: Record<string, unknown>
}

export async function readDoc(slug: string): Promise<Doc> {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Unexpected content slug: ${slug}`)
  }

  const source = await readFile(path.join(CONTENT_DIR, `${slug}.md`), "utf8")
  const document = await parseMarkdown(source)

  return {
    slug,
    source,
    document,
    frontmatter: (document.frontmatter ?? {}) as Record<string, unknown>,
  }
}
