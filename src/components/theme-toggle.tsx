"use client"

/**
 * No state: which label to show is decided by the `dark` class the toggle
 * itself sets, which also keeps the button correct on first paint without a
 * hydration mismatch.
 */
export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem("theme", next ? "dark" : "light")
    } catch {
      // Private mode or blocked storage: the toggle still works for this visit.
    }
  }

  return (
    <button
      aria-label="Toggle dark mode"
      className="text-graph-muted hover:text-graph-accent font-mono text-xs tracking-wide uppercase transition-colors"
      onClick={toggle}
      type="button"
    >
      <span className="dark:hidden">dark</span>
      <span className="hidden dark:inline">light</span>
    </button>
  )
}
