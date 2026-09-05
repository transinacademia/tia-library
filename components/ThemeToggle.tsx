'use client'

import React, { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const KEY = 'tia-library-theme'
const CHOICES: { value: Theme; label: string; glyph: React.ReactNode }[] = [
  {
    value: 'light',
    label: '浅色',
    glyph: (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="2.75" />
        <path d="M8 1.5v1.75M8 12.75v1.75M1.5 8h1.75M12.75 8h1.75M3.4 3.4l1.24 1.24M11.36 11.36l1.24 1.24M3.4 12.6l1.24-1.24M11.36 4.64l1.24-1.24" />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: '深色',
    glyph: (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M13.5 9.6A5.75 5.75 0 0 1 6.4 2.5a5.75 5.75 0 1 0 7.1 7.1z" />
      </svg>
    ),
  },
]

function effective(): Theme {
  const stamped = document.documentElement.dataset.theme
  if (stamped === 'light' || stamped === 'dark') return stamped
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Two words and one rule. Which word is lit and where the rule sits is decided by CSS
// from html[data-theme], so it is right at first paint; React state only feeds
// aria-checked, the roving tabindex, and the click handler.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => setTheme(effective())
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const choose = (next: Theme) => {
    const root = document.documentElement
    const commit = () => {
      root.dataset.theme = next
      try { localStorage.setItem(KEY, next) } catch {}
      setTheme(next)
    }
    // Same look as now, but the choice is now explicit and survives an OS theme change.
    if (next === effective()) { commit(); return }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready?: Promise<void> } | void }
    if (!reduce && typeof doc.startViewTransition === 'function') {
      const transition = doc.startViewTransition(commit)
      // A transition skipped by the browser (hidden tab, rapid clicks) rejects `ready`; not an error here.
      if (transition && transition.ready) transition.ready.catch(() => {})
    } else commit()
  }

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="颜色主题">
      {CHOICES.map(({ value, label, glyph }) => (
        <button
          key={value}
          type="button"
          role="radio"
          className="theme-choice"
          data-value={value}
          aria-checked={theme === value}
          tabIndex={theme === null ? (value === 'light' ? 0 : -1) : theme === value ? 0 : -1}
          onClick={() => choose(value)}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
            e.preventDefault()
            const other: Theme = value === 'light' ? 'dark' : 'light'
            choose(other)
            e.currentTarget.parentElement?.querySelector<HTMLElement>(`[data-value="${other}"]`)?.focus()
          }}
        >
          {glyph}
          <span className="theme-choice-label">{label}</span>
          <span className="sr-only">模式</span>
        </button>
      ))}
    </div>
  )
}
