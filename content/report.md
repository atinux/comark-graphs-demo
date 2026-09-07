---
title: Platform Report
period: Q3 2026
author: Platform Infrastructure
summary: Traffic, latency and delivery for the quarter, with the figures written inline.
---

# Platform Report — Q3 2026

This whole page is one Markdown file. The prose is CommonMark, and every figure
in it is a [Comark](https://comark.dev) component block that resolves to a
[markdown-graphs](https://mdx-graphs.kshv.me) React component at render time.
No MDX, no compile step: the file is read and parsed on each request, so the
same code path would serve Markdown arriving from a database or a model.

::graph-stat
---
title: Quarter at a glance
items:
  - { value: "99.98%", label: "Availability", hint: "SLO 99.95%", accent: true }
  - { value: "128ms", label: "p95 response", hint: "-14% vs Q2" }
  - { value: "41.2M", label: "Requests", hint: "peak 890 rps" }
  - { value: "312", label: "Deploys", hint: "3.4 per weekday" }
---
::

## Traffic

Requests grew through the quarter without a matching rise in latency. The
September step comes from the search rollout described further down.

::graph-plot
---
title: Requests per week (millions)
data: [2.4, 2.5, 2.7, 2.6, 2.9, 3.1, 3.0, 3.3, 3.5, 3.4, 3.8, 4.1, 4.0, 4.3]
labels: [Jul, Aug, Sep, Oct]
variant: area
height: 8
palette: duo
---
::

Latency held flat while volume rose by two thirds. The p95 line is the one we
report against; p99 stayed inside budget but is noisier.

::graph-kpi
---
title: p95 server response
value: 128 ms
label: 14-week trend
hint: budget 200 ms, never breached
data: [186, 181, 174, 178, 165, 160, 158, 149, 151, 142, 139, 134, 130, 128]
---
::

### Where the time goes

Latency by region and hour of day, in UTC. Ap-southeast is the one region
without a local read replica, and it shows.

::graph-heatmap
---
title: p95 by region and hour (UTC)
columns: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"]
max: 9
legend: true
caption: Darker is slower. Scale is relative to the worst cell.
rows:
  - { label: "us-east-1", values: [1, 1, 1, 2, 3, 4, 5, 6, 6, 5, 3, 2] }
  - { label: "us-west-2", values: [1, 1, 1, 1, 2, 3, 4, 5, 5, 4, 2, 1] }
  - { label: "eu-west-1", values: [3, 4, 5, 6, 6, 5, 4, 3, 2, 2, 1, 2] }
  - { label: "ap-southeast-1", values: [6, 7, 8, 9, 9, 8, 7, 5, 4, 3, 4, 5] }
---
::

## Delivery

Twelve of thirteen weeks were fully green. The 12 August window was a
degraded config push, caught by canary and rolled back in nine minutes.

::graph-uptime
---
title: Daily status, last 13 weeks
from: Jul 1
to: Sep 30
columns: 26
days: [ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, degraded, degraded, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok, ok]
---
::

Bundle sizes are the one budget we came close to breaking. `/search` is over
its allowance and is the first thing on next quarter's list.

::graph-table
---
title: Route bundles against budget
headers: [Route, First load, Budget, Headroom]
align: [left, right, right, right]
rows:
  - ["/", "94 kB", "110 kB", "+16 kB"]
  - ["/docs", "121 kB", "140 kB", "+19 kB"]
  - ["/dashboard", "168 kB", "180 kB", "+12 kB"]
  - ["/search", "204 kB", "180 kB", "-24 kB"]
footer: [4 routes, "587 kB", "610 kB", "+23 kB"]
---
::

::graph-meter{title="Test coverage" value=0.86 ticks=28 caption="86% of statements, up from 79%"}
::

## The search rollout

Search shipped behind a flag on 2 August and reached everyone on 14 September.
The request path picked up two hops, which is where the September latency step
in the traffic chart comes from.

::graph-flow
---
title: Request path after the rollout
rows:
  - nodes:
      - { label: "client" }
      - { label: "edge cache", tone: muted }
      - { label: "router", stretch: true }
  - nodes:
      - { label: "router" }
      - { label: "search api", tone: accent }
      - { label: "index shard", tone: accent }
  - nodes:
      - { label: "router" }
      - { label: "app server" }
      - { label: "postgres", tone: muted }
---
::

::graph-timeline
---
title: Rollout
events:
  - { date: "Aug 2", label: "Flag on for staff", state: done }
  - { date: "Aug 19", label: "5% of traffic", state: done }
  - { date: "Sep 3", label: "50%, replicas added", state: done }
  - { date: "Sep 14", label: "Full rollout", state: done }
  - { date: "Oct 6", label: "Remove the flag", state: now }
  - { date: "Oct 20", label: "Retire the old path", state: next }
---
::

Adoption ran roughly a third of sessions, and converted better than browse.

::graph-funnel
---
title: Search sessions to result click
stage: 7-day window, all regions
ticks: 32
steps:
  - { label: "Sessions", value: 1000, display: "412k" }
  - { label: "Opened search", value: 344, display: "142k" }
  - { label: "Typed a query", value: 291, display: "120k" }
  - { label: "Saw results", value: 286, display: "118k" }
  - { label: "Clicked a result", value: 214, display: "88k" }
---
::

## Next quarter

::graph-gantt
---
title: Committed work
stage: Oct — Dec
columns: 24
progress: 0.08
ticks: [Oct, Nov, Dec]
items:
  - { label: "Split /search bundle", start: 0, end: 6, accent: true, complete: 0.15 }
  - { label: "ap-southeast replica", start: 2, end: 9, accent: true }
  - { label: "Retire legacy path", start: 6, end: 12 }
  - { label: "Config canary v2", start: 9, end: 17 }
  - { label: "Cost review", start: 16, end: 23 }
---
::

::graph-check
---
title: Exit criteria
items:
  - { label: "SLO holds at 99.95%", done: true }
  - { label: "p95 under 200 ms", done: true, note: "128 ms" }
  - { label: "Every route inside budget", note: "/search over by 24 kB" }
  - { label: "Legacy search path removed", note: "blocked on the flag" }
  - { label: "Runbook reviewed", done: true }
---
::

---

Every figure above is a `::graph-*` block in `content/report.md`. Switch to the
source view to read the block that produced any of them, or see the
[catalog](/catalog) for the rest of the components.
