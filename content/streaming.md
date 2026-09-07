---
title: Incident 4412
summary: A short write-up, streamed a few characters at a time.
---

## Incident 4412 — config push, 12 August

A config push at 14:02 UTC sent malformed cache headers to two thirds of edge
nodes. Canary caught it, and the rollback finished at 14:11.

::graph-timeline
---
title: Nine minutes
events:
  - { date: "14:02", label: "Config push begins", state: done }
  - { date: "14:04", label: "Canary error rate crosses 2%", state: done }
  - { date: "14:06", label: "Paged, rollback started", state: done }
  - { date: "14:11", label: "Error rate back to baseline", state: done }
  - { date: "14:40", label: "All-clear posted", state: done }
---
::

Error rate over the window, in tenths of a percent:

::graph-spark
---
title: Error rate, 14:00 to 14:45
data: [1, 1, 24, 38, 41, 39, 33, 18, 6, 2, 1, 1, 1, 1, 1]
caption: Three minutes to detect, five to recover.
---
::

Two of six services were affected. Reads degraded; writes never did.

::graph-check
---
title: Blast radius
items:
  - { label: "Edge cache", done: true, note: "stale headers served" }
  - { label: "Search API", done: true, note: "elevated p95" }
  - { label: "App servers", note: "unaffected" }
  - { label: "Postgres", note: "unaffected" }
  - { label: "Write path", note: "unaffected" }
---
::

::graph-meter{title="Requests served correctly" value=0.973 ticks=30 caption="97.3% over the 45-minute window"}
::

## Follow-ups

Config changes now go through the same canary gate as code, which is the one
thing that would have caught this before the push rather than after.

::graph-table
---
title: Actions
headers: [Action, Owner, Due]
align: [left, left, right]
rows:
  - ["Canary gate for config", "Platform", "Sep 5"]
  - ["Header contract tests", "Edge", "Sep 12"]
  - ["Rollback runbook rewrite", "Platform", "Sep 19"]
---
::
