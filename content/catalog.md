---
title: Component catalog
summary: Every markdown-graphs component that the report does not already use, each one authored as a Comark block.
---

# Component catalog

The [report](/) uses twelve of these. Here is the rest of the set, so you can
see what a `::graph-*` block looks like for every shape in the library. Each
figure below is a block in `content/catalog.md` — nothing on this page is
written in TSX.

## Records

::graph-sheet
---
title: Spend by team
headers: [Line, Monthly, Annual]
align: [left, right, right]
sections:
  - title: Compute
    rows:
      - ["App servers", "$4,210", "$50,520"]
      - ["Search shards", "$1,880", "$22,560"]
  - title: Storage
    rows:
      - ["Postgres", "$2,340", "$28,080"]
      - ["Object store", "$610", "$7,320"]
  - title: Network
    rows:
      - ["Egress", "$1,120", "$13,440"]
footer: [Total, "$10,160", "$121,920"]
---
::

Comark blocks nest, so two narrow figures can share a row. `::row` is not a
graph — it is a layout component in the same map, taking the figures as
children.

::row{cols=2}
  ::graph-spec
  ---
  title: Runtime
  rows:
    - { label: "Node", value: "22.11 LTS" }
    - { label: "Region", value: "iad1", accent: true }
    - { label: "Memory", value: "1024 MB" }
    - { label: "Max duration", value: "60s" }
    - { label: "Concurrency", value: "1000" }
  ---
  ::

  ::graph-calendar
  ---
  title: October
  year: 2026
  month: 10
  weekStartsOn: 1
  today: 6
  marks:
    - { day: 6, accent: true }
    - { day: 20, accent: true }
    - { day: 13 }
    - { day: 27 }
  ---
  ::
::

::graph-matrix
---
title: Feature support by plan
columns: [Hobby, Pro, Enterprise]
accent: Pro
rows:
  - { label: "Seats", values: [1, 10, "unlimited"] }
  - { label: "Build minutes", values: [100, 6000, "custom"] }
  - { label: "Log retention", values: ["1d", "30d", "1y"] }
  - { label: "Support SLA", values: ["—", "1 day", "1 hour"] }
---
::

::graph-compare
---
title: Rendering strategies
columns: [Static, ISR, Streamed]
accent: ISR
rows:
  - { label: "Cached at edge", values: [true, true, false] }
  - { label: "Revalidates", values: [false, true, true] }
  - { label: "Personalised", values: [false, false, true] }
  - { label: "TTFB", values: ["12ms", "18ms", "94ms"] }
---
::

::graph-diff
---
title: Bundle change this release
rows:
  - { label: "react-dom", value: "+2.1 kB", sign: add }
  - { label: "date helpers", value: "+0.8 kB", sign: add }
  - { label: "legacy search client", value: "-14.6 kB", sign: remove }
  - { label: "icons", value: "0", sign: keep }
footer: { label: "Net", value: "-11.7 kB", sign: remove }
---
::

::graph-invoice
---
title: Invoice 2026-0914
from:
  name: Northwind Platform
  lines: ["12 Rue de Rivoli", "75001 Paris, FR"]
to:
  name: Acme Corp
  lines: ["500 Market St", "San Francisco, CA"]
meta:
  - { label: "Issued", value: "14 Sep 2026" }
  - { label: "Due", value: "14 Oct 2026" }
  - { label: "Terms", value: "Net 30" }
items:
  - { description: "Platform subscription", qty: "1", rate: "$2,400", amount: "$2,400.00" }
  - { description: "Additional seats", qty: "14", rate: "$40", amount: "$560.00" }
  - { description: "Egress overage", qty: "820 GB", rate: "$0.09", amount: "$73.80" }
totals:
  - { label: "Subtotal", value: "$3,033.80" }
  - { label: "VAT 20%", value: "$606.76" }
  - { label: "Due", value: "$3,640.56", accent: true }
note: Payment by transfer. Reference the invoice number.
---
::

## Series

::graph-spark
---
title: Error rate, 24 hours
data: [3, 2, 4, 3, 5, 8, 6, 4, 3, 2, 2, 3, 4, 3, 2, 1, 2, 3, 2, 2, 1, 1, 2, 1]
caption: Peak at 06:00 UTC during the nightly reindex.
---
::

::graph-bars
---
title: Build time before and after caching
processor: turbopack, 8 vCPU
from: { label: "Before", values: [42, 39, 44, 41, 43, 40, 45] }
to: { label: "After", values: [12, 11, 13, 10, 12, 11, 12] }
palette: duo
---
::

::graph-slope
---
title: p95 by route, quarter over quarter
fromLabel: Q2
toLabel: Q3
items:
  - { label: "/", from: 96, to: 71 }
  - { label: "/docs", from: 142, to: 118 }
  - { label: "/dashboard", from: 210, to: 164 }
  - { label: "/search", from: 168, to: 198 }
---
::

::graph-cells
---
title: Cache hit ratio by shard
items:
  - { label: "shard-0", cells: [[4, 4, 3, 4], [4, 3, 4, 4]] }
  - { label: "shard-1", cells: [[3, 2, 3, 3], [4, 3, 2, 3]] }
  - { label: "shard-2", cells: [[1, 2, 1, 2], [2, 1, 2, 1]] }
---
::

## Proportions

::graph-rank
---
title: Slowest endpoints
ticks: 30
items:
  - { label: "POST /api/search", value: 198, display: "198 ms" }
  - { label: "GET /api/feed", value: 164, display: "164 ms" }
  - { label: "GET /api/user", value: 88, display: "88 ms" }
  - { label: "POST /api/events", value: 41, display: "41 ms" }
  - { label: "GET /api/health", value: 6, display: "6 ms" }
---
::

::graph-bullet
---
title: Budgets
ticks: 28
items:
  - { label: "p95 latency", value: 128, target: 200, max: 260, display: "128 / 200 ms" }
  - { label: "Error rate", value: 0.12, target: 0.5, max: 1, display: "0.12 / 0.50%" }
  - { label: "Bundle", value: 587, target: 610, max: 700, display: "587 / 610 kB" }
  - { label: "Monthly spend", value: 10160, target: 9500, max: 12000, display: "$10.2k / $9.5k" }
---
::

::graph-stack
---
title: Requests by response class
accent: 2xx
ticks: 32
rows:
  - label: Jul
    segments:
      - { label: "2xx", value: 96 }
      - { label: "3xx", value: 3 }
      - { label: "5xx", value: 1 }
  - label: Aug
    segments:
      - { label: "2xx", value: 94 }
      - { label: "3xx", value: 4 }
      - { label: "5xx", value: 2 }
  - label: Sep
    segments:
      - { label: "2xx", value: 98 }
      - { label: "3xx", value: 2 }
      - { label: "5xx", value: 0 }
palette: multi
---
::

::graph-waterfall
---
title: Cost movement, Q2 to Q3
ticks: 30
items:
  - { label: "Q2 spend", value: 8400, display: "$8,400", kind: start }
  - { label: "Search shards", value: 1880, display: "+$1,880", kind: in }
  - { label: "Replica", value: 620, display: "+$620", kind: in }
  - { label: "Legacy path off", value: -740, display: "-$740", kind: out }
  - { label: "Q3 spend", value: 10160, display: "$10,160", kind: end }
---
::

::graph-waffle{title="Rollout reach" value=0.72 cells=100 columns=20 caption="72% of projects on the new runtime"}
::

## Grids over time

::graph-activity
---
title: Commits, last 13 weeks
weekStartsOn: 1
legend: true
caption: One cell per day. Weekends are quieter, as you would hope.
days:
  - { date: "2026-06-29", count: 4 }
  - { date: "2026-06-30", count: 2 }
  - { date: "2026-07-01", count: 5 }
  - { date: "2026-07-02", count: 0 }
  - { date: "2026-07-03", count: 3 }
  - { date: "2026-07-04", count: 1 }
  - { date: "2026-07-05", count: 0 }
  - { date: "2026-07-06", count: 11 }
  - { date: "2026-07-07", count: 3 }
  - { date: "2026-07-08", count: 8 }
  - { date: "2026-07-09", count: 3 }
  - { date: "2026-07-10", count: 1 }
  - { date: "2026-07-11", count: 2 }
  - { date: "2026-07-12", count: 0 }
  - { date: "2026-07-13", count: 6 }
  - { date: "2026-07-14", count: 3 }
  - { date: "2026-07-15", count: 0 }
  - { date: "2026-07-16", count: 4 }
  - { date: "2026-07-17", count: 8 }
  - { date: "2026-07-18", count: 0 }
  - { date: "2026-07-19", count: 1 }
  - { date: "2026-07-20", count: 5 }
  - { date: "2026-07-21", count: 3 }
  - { date: "2026-07-22", count: 11 }
  - { date: "2026-07-23", count: 6 }
  - { date: "2026-07-24", count: 2 }
  - { date: "2026-07-25", count: 2 }
  - { date: "2026-07-26", count: 0 }
  - { date: "2026-07-27", count: 4 }
  - { date: "2026-07-28", count: 1 }
  - { date: "2026-07-29", count: 3 }
  - { date: "2026-07-30", count: 8 }
  - { date: "2026-07-31", count: 5 }
  - { date: "2026-08-01", count: 1 }
  - { date: "2026-08-02", count: 0 }
  - { date: "2026-08-03", count: 6 }
  - { date: "2026-08-04", count: 11 }
  - { date: "2026-08-05", count: 4 }
  - { date: "2026-08-06", count: 3 }
  - { date: "2026-08-07", count: 0 }
  - { date: "2026-08-08", count: 2 }
  - { date: "2026-08-09", count: 1 }
  - { date: "2026-08-10", count: 5 }
  - { date: "2026-08-11", count: 8 }
  - { date: "2026-08-12", count: 3 }
  - { date: "2026-08-13", count: 6 }
  - { date: "2026-08-14", count: 3 }
  - { date: "2026-08-15", count: 0 }
  - { date: "2026-08-16", count: 0 }
  - { date: "2026-08-17", count: 4 }
  - { date: "2026-08-18", count: 2 }
  - { date: "2026-08-19", count: 11 }
  - { date: "2026-08-20", count: 1 }
  - { date: "2026-08-21", count: 3 }
  - { date: "2026-08-22", count: 1 }
  - { date: "2026-08-23", count: 2 }
  - { date: "2026-08-24", count: 8 }
  - { date: "2026-08-25", count: 6 }
  - { date: "2026-08-26", count: 3 }
  - { date: "2026-08-27", count: 5 }
  - { date: "2026-08-28", count: 4 }
  - { date: "2026-08-29", count: 0 }
  - { date: "2026-08-30", count: 1 }
  - { date: "2026-08-31", count: 3 }
  - { date: "2026-09-01", count: 11 }
  - { date: "2026-09-02", count: 6 }
  - { date: "2026-09-03", count: 8 }
  - { date: "2026-09-04", count: 3 }
  - { date: "2026-09-05", count: 2 }
  - { date: "2026-09-06", count: 0 }
  - { date: "2026-09-07", count: 5 }
  - { date: "2026-09-08", count: 4 }
  - { date: "2026-09-09", count: 3 }
  - { date: "2026-09-10", count: 1 }
  - { date: "2026-09-11", count: 8 }
  - { date: "2026-09-12", count: 0 }
  - { date: "2026-09-13", count: 1 }
  - { date: "2026-09-14", count: 11 }
  - { date: "2026-09-15", count: 6 }
  - { date: "2026-09-16", count: 4 }
  - { date: "2026-09-17", count: 3 }
  - { date: "2026-09-18", count: 5 }
  - { date: "2026-09-19", count: 2 }
  - { date: "2026-09-20", count: 0 }
  - { date: "2026-09-21", count: 3 }
  - { date: "2026-09-22", count: 8 }
  - { date: "2026-09-23", count: 1 }
  - { date: "2026-09-24", count: 4 }
  - { date: "2026-09-25", count: 6 }
  - { date: "2026-09-26", count: 1 }
  - { date: "2026-09-27", count: 0 }
---
::

## Structure

::graph-tree
---
title: Repository
nodes:
  - label: content/
    accent: true
    children:
      - { label: "report.md", meta: "the page you landed on" }
      - { label: "catalog.md", meta: "this page" }
  - label: src/
    children:
      - label: comark/
        accent: true
        children:
          - { label: "graph-components.tsx", meta: "tag → component map" }
          - { label: "coerce.ts", meta: "string props → typed props" }
      - label: registry/default/
        children:
          - { label: "graph-frame/", meta: "shared frame + motion" }
          - { label: "graph-*/", meta: "33 components" }
      - label: app/
        children:
          - { label: "page.tsx", meta: "reads the .md, renders it" }
---
::

## Clocks

These two update on their own once mounted, which is worth seeing in a
Markdown file — the block is static text, the component is live.

::row{cols=2}
  ::graph-timer{title="Uptime" kind="elapsed" at="2026-09-14T08:00:00Z" caption="since the last deploy"}
  ::

  ::graph-countdown{title="Flag removal" to="2026-10-06T09:00:00Z" done="Shipped" caption="when the legacy path goes away"}
  ::
::
