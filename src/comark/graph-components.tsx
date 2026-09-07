/**
 * The bridge between the two libraries.
 *
 * Every entry maps a Comark tag (`::graph-table`) to a markdown-graphs
 * component, wrapped in a thin adapter that does two things Markdown props
 * need: normalise them (see `./coerce`), and hold the figure back until the
 * props it cannot render without have actually arrived.
 *
 * Anything not listed here is not renderable from Markdown — the map is the
 * allowlist.
 */

import type { ComponentType } from "react"

import { coerceProps, type NumericProps } from "@/comark/coerce"
import { GraphRow } from "@/comark/layout"
import * as Graphs from "@/registry/default"
import { Graph, GraphBody } from "@/registry/default/graph-frame/graph-frame"

/**
 * Shown while a block's props are still incomplete.
 *
 * This matters when the Markdown is streaming. Comark auto-closes the dangling
 * `::graph-table` as soon as it sees it, but a component block's props live in
 * a `---` fence that the parser only accepts once its closing fence arrives —
 * all or nothing. So for a few frames the tag exists with no props at all, and
 * `rows.map(...)` inside a graph would throw. Reserving the frame keeps the
 * layout stable and lets the figure fill in when the props land.
 */
function PendingGraph({ title }: { title?: string }) {
  return (
    <Graph title={title}>
      <GraphBody className="flex items-center justify-center py-14">
        <span className="text-graph-frame font-mono text-sm select-none">
          · · ·
        </span>
      </GraphBody>
    </Graph>
  )
}

type Adapter = {
  /** Props the component wants as numbers rather than strings. */
  numeric?: NumericProps
  /** Props the component cannot render without. */
  required?: readonly string[]
}

function isPresent(value: unknown): boolean {
  if (value == null) return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === "string") return value.trim() !== ""
  return true
}

/**
 * A key that changes when a figure's data changes, so the graph remounts.
 *
 * The graphs animate their rows in with `whileInView` and `viewport={{ once:
 * true }}`. When the Markdown is streaming, rows arrive one at a time — and
 * children mounted after the parent's once-only animation has already fired
 * never receive the variant, so they sit at `opacity: 0` forever. Remounting on
 * a data change lets the animation run again over the full set.
 *
 * On a static page the props never change, so this costs one string per figure
 * and nothing else. `children` is skipped: React elements are cyclic, and a
 * layout block's identity is its own props, not its contents.
 */
function propsKey(props: Record<string, unknown>): string | undefined {
  try {
    const parts: string[] = []
    for (const [key, value] of Object.entries(props)) {
      if (key === "children") continue
      parts.push(
        `${key}=${typeof value === "object" && value !== null ? JSON.stringify(value) : String(value)}`
      )
    }
    return parts.join("|")
  } catch {
    // Something unserialisable slipped in; a stable identity is fine.
    return undefined
  }
}

/** Wrap a graph component so it can be driven by Markdown props. */
function fromMarkdown<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  { numeric = [], required = [] }: Adapter = {}
) {
  function MarkdownGraph(raw: Record<string, unknown>) {
    const props = coerceProps<P>(raw, numeric)

    if (!required.every((key) => isPresent(props[key]))) {
      return <PendingGraph title={props.title as string | undefined} />
    }

    return <Component key={propsKey(props)} {...props} />
  }

  MarkdownGraph.displayName = `FromMarkdown(${
    Component.displayName ?? Component.name ?? "Graph"
  })`

  return MarkdownGraph as ComponentType<Record<string, unknown>>
}

/* eslint-disable @typescript-eslint/no-explicit-any -- the registry's prop
   types are structural; the lists below are what keeps the mapping honest. */
const graph = (Component: ComponentType<any>, adapter?: Adapter) =>
  fromMarkdown(Component, adapter)
/* eslint-enable @typescript-eslint/no-explicit-any */

export const graphComponents = {
  // Tables and records
  "graph-table": graph(Graphs.GraphTable, {
    required: ["headers", "rows"],
  }),
  "graph-sheet": graph(Graphs.GraphSheet, {
    required: ["headers", "sections"],
  }),
  "graph-invoice": graph(Graphs.GraphInvoice, { required: ["items"] }),
  "graph-spec": graph(Graphs.GraphSpec, { required: ["rows"] }),
  "graph-matrix": graph(Graphs.GraphMatrix, {
    required: ["columns", "rows"],
  }),
  "graph-compare": graph(Graphs.GraphCompare, {
    required: ["columns", "rows"],
  }),
  "graph-diff": graph(Graphs.GraphDiff, { required: ["rows"] }),

  // Numbers up front
  "graph-stat": graph(Graphs.GraphStat, { required: ["items"] }),
  "graph-kpi": graph(Graphs.GraphKpi, {
    required: ["value", "label", "data"],
  }),

  // Series
  "graph-spark": graph(Graphs.GraphSpark, { required: ["data"] }),
  "graph-plot": graph(Graphs.GraphPlot, {
    numeric: ["height", "progress"],
    required: ["data"],
  }),
  "graph-bars": graph(Graphs.GraphBars, { required: ["from", "to"] }),
  "graph-slope": graph(Graphs.GraphSlope, {
    required: ["fromLabel", "toLabel", "items"],
  }),
  "graph-cells": graph(Graphs.GraphCells, { required: ["items"] }),

  // Proportions
  "graph-meter": graph(Graphs.GraphMeter, {
    numeric: ["value", "ticks"],
    required: ["value"],
  }),
  "graph-waffle": graph(Graphs.GraphWaffle, {
    numeric: ["value", "cells", "columns"],
    required: ["value"],
  }),
  "graph-stack": graph(Graphs.GraphStack, {
    numeric: ["ticks"],
    required: ["rows"],
  }),
  "graph-funnel": graph(Graphs.GraphFunnel, {
    numeric: ["ticks"],
    required: ["steps"],
  }),
  "graph-waterfall": graph(Graphs.GraphWaterfall, {
    numeric: ["ticks"],
    required: ["items"],
  }),
  "graph-rank": graph(Graphs.GraphRank, {
    numeric: ["max", "ticks"],
    required: ["items"],
  }),
  "graph-bullet": graph(Graphs.GraphBullet, {
    numeric: ["ticks"],
    required: ["items"],
  }),

  // Grids over time
  "graph-heatmap": graph(Graphs.GraphHeatmap, {
    numeric: ["max"],
    required: ["columns", "rows"],
  }),
  "graph-activity": graph(Graphs.GraphActivity, {
    numeric: ["max", "weekStartsOn"],
    required: ["days"],
  }),
  "graph-calendar": graph(Graphs.GraphCalendar, {
    numeric: ["year", "month", "today", "weekStartsOn"],
    required: ["year", "month"],
  }),
  "graph-uptime": graph(Graphs.GraphUptime, {
    numeric: ["columns"],
    required: ["days"],
  }),

  // Structure and sequence
  "graph-flow": graph(Graphs.GraphFlow, { required: ["rows"] }),
  "graph-tree": graph(Graphs.GraphTree, { required: ["nodes"] }),
  "graph-timeline": graph(Graphs.GraphTimeline, { required: ["events"] }),
  "graph-gantt": graph(Graphs.GraphGantt, {
    numeric: ["columns", "progress"],
    required: ["items"],
  }),
  "graph-check": graph(Graphs.GraphCheck, { required: ["items"] }),

  // Clocks
  "graph-timer": graph(Graphs.GraphTimer),
  "graph-countdown": graph(Graphs.GraphCountdown, { required: ["to"] }),

  // Layout. Comark blocks nest, so this one takes the figures as children.
  row: graph(GraphRow, { numeric: ["cols"] }),
} satisfies Record<string, ComponentType<Record<string, unknown>>>

/** Every tag an author can reach for. Handy for docs and error messages. */
export const graphTags = Object.keys(graphComponents)
