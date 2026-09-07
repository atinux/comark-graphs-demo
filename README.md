# Comark × markdown-graphs

A demo of writing charts **inside a plain `.md` file**.

The prose is CommonMark. The figures are [Comark](https://comark.dev) component
blocks that resolve to [markdown-graphs](https://mdx-graphs.kshv.me) React
components — ASCII-framed tables, plots, heatmaps, flows and the rest — with no
MDX and no compile step. The Markdown is read off disk and parsed at request
time, so editing `content/report.md` and reloading is the whole loop.

```mdc
::graph-table
---
title: Route bundles against budget
headers: [Route, First load, Budget, Headroom]
align: [left, right, right, right]
rows:
  - ["/", "94 kB", "110 kB", "+16 kB"]
  - ["/search", "204 kB", "180 kB", "-24 kB"]
footer: [4 routes, "587 kB", "610 kB", "+23 kB"]
---
::
```

## Run it

```bash
npm install
npm run dev
```

| Route        | What it shows                                                                    |
| ------------ | -------------------------------------------------------------------------------- |
| `/`          | A quarterly report — twelve figures, all authored in `content/report.md`          |
| `/catalog`   | The rest of the component set, one block each, from `content/catalog.md`          |
| `/streaming` | The same Markdown revealed a few characters at a time and re-parsed every frame   |

Every page has a **Source** tab that shows the `.md` file that produced it.

## How the two libraries meet

Three files, and the middle one is the interesting one.

```
content/*.md                     the figures, as Comark component blocks
src/comark/graph-components.tsx  tag → component map (the allowlist)
src/comark/coerce.ts             Markdown props → typed React props
src/registry/default/graph-*/    the markdown-graphs components, copied in
```

`src/app/page.tsx` is the whole integration:

```tsx
const doc = await readDoc("report") // parseMarkdown() on the server

<MarkdownDocument components={graphComponents} value={doc.document} />
```

`MarkdownDocument` renders an already-parsed tree, so the Comark parser stays
out of the client bundle. The graph components are `"use client"` — they
animate — so they arrive as client references inside a server-rendered page.

### Passing real data through Markdown attributes

Markdown attributes are strings, which is the one genuine friction between the
two libraries. Comark handles the hard half: a component's props can be written
as a YAML block, and arrays and objects are JSON-encoded on the way in and
parsed back out, so `rows:` and `data:` arrive as real values.

```mdc
::graph-meter{title="Coverage" value=0.86 ticks=28}
::
```

What does not survive is scalar typing — `value` above arrives as `"0.86"`, and
`GraphMeter` wants a number. `src/comark/coerce.ts` closes that gap, and each
entry in the tag map declares which of its props are numeric:

```ts
"graph-meter": graph(Graphs.GraphMeter, {
  numeric: ["value", "ticks"],
  required: ["value"],
}),
```

`coerce.ts` also converts `"true"` / `"false"` to booleans, strips the leading
`:` from Comark's binding-style keys (`{legend}` → `:legend`), and maps `class`
to `className` so `{.max-w-xl}` works on a figure.

### Layout, because blocks nest

`::row` is in the same map but is not a graph — it takes the figures as
children, which is how two narrow ones share a line:

```mdc
::row{cols=2}
  ::graph-timer{title="Uptime" kind="elapsed" at="2026-09-14T08:00:00Z"}
  ::

  ::graph-countdown{title="Flag removal" to="2026-10-06T09:00:00Z"}
  ::
::
```

### What streaming actually costs

Comark's headline feature is that incomplete documents render, which matters
when the Markdown is coming from a model token by token. `/streaming` runs that
case and shows where the seams are.

Two things hold up well. Auto-close completes dangling syntax, so a half-written
`::graph-table` does not swallow the rest of the page. And a component's props
only count once the closing `---` of their fence arrives, so props are
all-or-nothing rather than half-parsed — a partial list of *complete* YAML items
is still valid, so a timeline visibly grows an event at a time.

One thing does not. A prefix that cuts mid-YAML-key makes the fence parse as
invalid YAML and `parseMarkdown` **throws** — about 8% of the character
prefixes of `content/streaming.md` do this, measured across every prefix:

```
total 1832 prefixes, 153 threw (8.4%)
  YAMLException: expected ':' after a mapping key
```

So `StreamingDemo` parses defensively and keeps the last good tree on screen for
those frames, which is what the "frames held" counter reports. There is no
parser option to relax this in `comark@0.6.2`.

The other gap is on the component side: in the frames where a tag exists with no
props yet, a graph would call `rows.map(...)` on `undefined`. Each adapter
declares its `required` props and renders an empty frame until they land, which
also keeps the layout from jumping.

## Credits

- [Comark](https://github.com/comarkdown/comark) — MIT
- [markdown-graphs](https://github.com/keshav-exe/markdown-graphs) by
  [@keshav-exe](https://github.com/keshav-exe) — MIT. The components under
  `src/registry/default/` are copied from that repo, which is how its shadcn
  registry is meant to be consumed (`shadcn add https://mdx-graphs.kshv.me/r/all.json`
  when you have network access to it). Its licence travels with them in
  `src/registry/default/LICENSE`.
