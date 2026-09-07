"use client"

import { useEffect, useState } from "react"
import { MarkdownDocument } from "@comark/react"
import { parseMarkdown, type MarkdownDocument as Doc } from "comark"

import { graphComponents } from "@/comark/graph-components"
import { cn } from "@/lib/utils"

const SPEEDS = [
  { label: "1×", chars: 6 },
  { label: "3×", chars: 18 },
  { label: "8×", chars: 48 },
] as const

const TICK_MS = 24

/**
 * Reveals the Markdown a few characters at a time and re-parses every frame.
 *
 * Two things keep the output stable while the document is incomplete:
 *
 * 1. Comark's auto-close completes dangling syntax, so an unterminated `**bold`
 *    or a half-written `::graph-table` block does not swallow the rest of the
 *    page.
 * 2. A component's props live in a `---` fence, and Comark only accepts that
 *    fence once its closing line arrives — so props are all-or-nothing, never
 *    half-parsed. In the window before they land the tag renders with no props
 *    at all, which is what the adapters in `src/comark/graph-components.tsx`
 *    turn into a reserved frame.
 *
 * The one case neither covers: a prefix that cuts mid-YAML-key can make the
 * props fence parse as invalid YAML, and `parseMarkdown` throws. Roughly 8% of
 * the prefixes of this document do that. Holding the last good tree for those
 * frames is both the fix and the honest thing to show — a real streaming UI
 * wants the previous frame, not an error boundary.
 */
export function StreamingDemo({ source }: { source: string }) {
  const [cursor, setCursor] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [doc, setDoc] = useState<Doc | null>(null)
  const [held, setHeld] = useState(0)

  const done = cursor >= source.length
  const partial = source.slice(0, cursor)

  useEffect(() => {
    if (!playing || done) return

    const step = SPEEDS[speed].chars
    const id = setInterval(() => {
      setCursor((current) => Math.min(source.length, current + step))
    }, TICK_MS)

    return () => clearInterval(id)
  }, [playing, done, speed, source.length])

  useEffect(() => {
    // `restart` clears the tree; nothing to parse until the first chunk lands.
    if (!partial) return

    let cancelled = false

    parseMarkdown(partial)
      .then((next) => {
        if (!cancelled) setDoc(next)
      })
      .catch(() => {
        // Unparseable prefix — keep the last good tree on screen.
        if (!cancelled) setHeld((count) => count + 1)
      })

    return () => {
      cancelled = true
    }
  }, [partial])

  const progress = source.length ? cursor / source.length : 0

  function restart() {
    setHeld(0)
    setDoc(null)
    setCursor(0)
    setPlaying(true)
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          className="text-graph-accent font-mono text-xs tracking-wide uppercase"
          onClick={() => (done ? restart() : setPlaying(true))}
          type="button"
        >
          [ {done ? "Replay" : playing ? "Streaming" : "Resume"} ]
        </button>

        <button
          className="text-graph-muted hover:text-foreground font-mono text-xs tracking-wide uppercase transition-colors disabled:opacity-40"
          disabled={done || !playing}
          onClick={() => setPlaying(false)}
          type="button"
        >
          Pause
        </button>

        <span aria-hidden="true" className="text-graph-frame font-mono text-xs">
          |
        </span>

        {SPEEDS.map((option, index) => (
          <button
            className={cn(
              "font-mono text-xs tracking-wide uppercase transition-colors",
              speed === index
                ? "text-graph-accent"
                : "text-graph-muted hover:text-foreground"
            )}
            key={option.label}
            onClick={() => setSpeed(index)}
            type="button"
          >
            {option.label}
          </button>
        ))}

        <span className="text-graph-muted ml-auto font-mono text-xs tabular-nums">
          {cursor}/{source.length} chars
          {held > 0 ? ` · ${held} frames held` : ""}
        </span>
      </div>

      <div aria-hidden="true" className="graph-frame mb-12 h-1.5 w-full">
        <div
          className="bg-graph-accent h-full transition-[width] duration-100 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {doc ? (
        <MarkdownDocument
          caret={!done}
          className="comark-prose"
          components={graphComponents}
          streaming={!done}
          value={doc}
        />
      ) : (
        <p className="text-graph-muted font-mono text-sm">Waiting for output…</p>
      )}
    </div>
  )
}
