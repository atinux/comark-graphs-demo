import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"

import { SiteHeader } from "@/components/site-header"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Comark × markdown-graphs",
    template: "%s — Comark × markdown-graphs",
  },
  description:
    "A demo of Comark's component syntax driving markdown-graphs figures from a plain .md file.",
}

/**
 * Set the theme before first paint so the graph accents don't flash. Reads a
 * stored choice, falls back to the OS preference.
 */
const themeScript = `
try {
  var stored = localStorage.getItem("theme")
  var dark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches
  if (dark) document.documentElement.classList.add("dark")
} catch (e) {}
`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <SiteHeader />
        <main className="mx-auto w-full max-w-4xl px-5 pb-24 sm:px-8">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
