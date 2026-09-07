/**
 * Layout blocks for the Markdown side.
 *
 * Comark component blocks nest, so a `::row` can hold two `::graph-*` blocks
 * and the children arrive as ordinary React children. That is the one thing an
 * author can't express with a graph component alone: putting two small figures
 * next to each other.
 *
 * ```mdc
 * ::row
 *   ::graph-meter{title="Coverage" value=0.86}
 *   ::
 *
 *   ::graph-waffle{title="Rollout" value=0.72}
 *   ::
 * ::
 * ```
 */

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const columnClass: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
}

export function GraphRow({
  cols = 2,
  className,
  children,
}: {
  cols?: number
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        columnClass[Math.min(Math.max(cols, 2), 3)],
        // The figures bring their own vertical margin; the row owns the gap.
        "[&>figure]:my-0",
        className
      )}
    >
      {children}
    </div>
  )
}
