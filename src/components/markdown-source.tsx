import { cn } from "@/lib/utils"

/**
 * A deliberately small line-based highlighter for the source pane.
 *
 * The point of the demo is that the figures are authored in Markdown, so the
 * source view only needs to make the Comark syntax stand out from the prose:
 * component markers, the YAML props fence, and prop keys.
 */

type LineKind = "component" | "fence" | "key" | "heading" | "text"

function classify(line: string, inProps: boolean): LineKind {
  const trimmed = line.trimStart()
  if (trimmed.startsWith("::")) return "component"
  if (trimmed === "---") return "fence"
  if (trimmed.startsWith("#")) return "heading"
  if (inProps) return "key"
  return "text"
}

type SourceLine = { line: string; kind: LineKind; number: number }

function classifyLines(source: string): SourceLine[] {
  const lines = source.replace(/\n$/, "").split("\n")
  const rows: SourceLine[] = []

  // Frontmatter and component prop blocks are both fenced with `---`, so a
  // running flag is what tells prose apart from props.
  let inProps = false

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const kind = classify(line, inProps)
    if (kind === "fence") inProps = !inProps
    rows.push({ line, kind, number: index + 1 })
  }

  return rows
}

const lineClass: Record<LineKind, string> = {
  component: "text-graph-accent",
  fence: "text-graph-frame",
  key: "text-graph-muted",
  heading: "text-foreground",
  text: "text-foreground/80",
}

export function MarkdownSource({
  source,
  className,
}: {
  source: string
  className?: string
}) {
  const rows = classifyLines(source)

  const gutter = String(rows.length).length

  return (
    <pre
      className={cn(
        "graph-frame graph-scroll-x px-5 py-7 font-mono text-xs leading-6 sm:px-8",
        className
      )}
    >
      <code>
        {rows.map(({ line, kind, number }) => (
          <span className="block whitespace-pre" key={number}>
            <span
              aria-hidden="true"
              className="text-graph-faint mr-4 inline-block text-right select-none"
              style={{ width: `${gutter}ch` }}
            >
              {number}
            </span>
            <span className={lineClass[kind]}>{line || " "}</span>
          </span>
        ))}
      </code>
    </pre>
  )
}
