import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"

const links = [
  { href: "/", label: "Report" },
  { href: "/catalog", label: "Catalog" },
  { href: "/streaming", label: "Streaming" },
]

const REPO_URL = "https://github.com/atinux/comark-graphs-demo"

/** Inlined rather than pulling in an icon package for a single glyph. */
function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-2.91-.88-2.91-3.14 0-.64.23-1.17.6-1.58-.06-.15-.26-.76.06-1.58 0 0 .61-.19 2 .75a5.6 5.6 0 0 1 1.51-.2c.51 0 1.03.07 1.51.2 1.39-.94 2-.75 2-.75.32.82.12 1.43.06 1.58.37.41.6.94.6 1.58 0 2.27-1.14 2.94-2.92 3.14.3.26.56.76.56 1.54 0 1.11-.01 2-.01 2.27 0 .21.15.46.55.38A7.99 7.99 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

export function SiteHeader() {
  return (
    <header className="mx-auto w-full max-w-4xl px-5 pt-8 pb-12 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <Link
          className="font-mono text-sm tracking-tight whitespace-nowrap"
          href="/"
        >
          <span className="text-graph-accent">::</span>
          graph
          <span className="text-graph-muted"> in </span>
          markdown
        </Link>

        <nav className="flex items-center gap-5">
          {links.map((link) => (
            <Link
              className="text-graph-muted hover:text-graph-accent font-mono text-xs tracking-wide uppercase transition-colors"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />

          <a
            aria-label="View the source on GitHub"
            className="text-graph-muted hover:text-graph-accent transition-colors"
            href={REPO_URL}
            rel="noreferrer noopener"
            target="_blank"
          >
            <GitHubIcon />
          </a>
        </nav>
      </div>

      <div className="graph-rule mt-8 w-full" />
    </header>
  )
}
