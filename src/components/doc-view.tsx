"use client"

import { useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Rendered / source switch.
 *
 * `rendered` arrives as an already-rendered tree from a Server Component, so
 * flipping to the source pane and back costs nothing — the Markdown is parsed
 * once, on the server.
 */
export function DocView({
  rendered,
  source,
  lines,
}: {
  rendered: ReactNode
  source: ReactNode
  lines: number
}) {
  const [view, setView] = useState<"rendered" | "source">("rendered")

  const tabs = [
    { id: "rendered" as const, label: "Rendered" },
    { id: "source" as const, label: `Source · ${lines} lines` },
  ]

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2">
        {tabs.map((tab) => (
          <button
            aria-pressed={view === tab.id}
            className={cn(
              "font-mono text-xs tracking-wide uppercase transition-colors",
              view === tab.id
                ? "text-graph-accent"
                : "text-graph-muted hover:text-foreground"
            )}
            key={tab.id}
            onClick={() => setView(tab.id)}
            type="button"
          >
            {view === tab.id ? "[ " : "  "}
            {tab.label}
            {view === tab.id ? " ]" : "  "}
          </button>
        ))}
      </div>

      <div hidden={view !== "rendered"}>{rendered}</div>
      <div hidden={view !== "source"}>{source}</div>
    </div>
  )
}
