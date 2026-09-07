import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"

const links = [
  { href: "/", label: "Report" },
  { href: "/catalog", label: "Catalog" },
  { href: "/streaming", label: "Streaming" },
]

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
        </nav>
      </div>

      <div className="graph-rule mt-8 w-full" />
    </header>
  )
}
