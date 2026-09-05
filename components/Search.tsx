'use client'

import React, { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Entry = { href: string; title: string; heading?: string; section: string; headings: string[]; excerpt: string }
type Hit = { entry: Entry; snippet: string | null }

// Both files are fetched on intent, never on mount, and cached for the page lifetime.
// search-index.json is small (titles, headings, an excerpt); search-text.json holds the
// plain bodies and is only pulled once someone has actually typed a query.
let indexPromise: Promise<Entry[]> | null = null
let textPromise: Promise<Record<string, string>> | null = null
const loadIndex = () =>
  (indexPromise ??= fetch('/search-index.json').then((r) => r.json() as Promise<Entry[]>).catch(() => { indexPromise = null; return [] }))
const loadText = () =>
  (textPromise ??= fetch('/search-text.json').then((r) => r.json() as Promise<Record<string, string>>).catch(() => { textPromise = null; return {} }))

// CJK is case-less; lowercasing keeps <mark> offsets aligned (NFKC would not).
const fold = (s: string) => s.toLowerCase()

// The sentence around the first match, trimmed at 。！？ or a line break where one is near.
function windowOf(text: string, q: string, before = 24, after = 48): string | null {
  const i = fold(text).indexOf(q)
  if (i < 0) return null
  const lo = Math.max(0, i - before)
  const hi = Math.min(text.length, i + q.length + after)
  const cut = Math.max(...['。', '！', '？', '\n'].map((c) => text.lastIndexOf(c, i)))
  const start = cut >= lo ? cut + 1 : lo
  const rel = text.slice(i, hi).search(/[。！？\n]/)
  const end = rel === -1 ? hi : i + rel + 1
  return (start === lo && lo > 0 ? '…' : '') + text.slice(start, end).trim() + (end === hi && hi < text.length ? '…' : '')
}

function rank(index: Entry[], text: Record<string, string> | null, q: string): Hit[] {
  const scored: (Hit & { score: number })[] = []
  for (const entry of index) {
    let score = 0
    if (fold(entry.title).includes(q)) score += 4
    if (entry.heading && fold(entry.heading).includes(q)) score += 3
    const heading = entry.headings.find((h) => fold(h).includes(q))
    if (heading) score += 2
    if (fold(entry.excerpt).includes(q)) score += 1
    const body = text?.[entry.href]
    if (!score && body && fold(body).includes(q)) score += 1
    if (!score) continue
    const snippet = (heading && windowOf(heading, q)) || windowOf(entry.excerpt, q) || (body ? windowOf(body, q) : null)
    scored.push({ entry, score, snippet })
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 12)
}

function Mark({ text, q }: { text: string; q: string }) {
  const i = q ? fold(text).indexOf(q) : -1
  if (i < 0) return <>{text}</>
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>
}

export default function Search() {
  const router = useRouter()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<Entry[] | null>(null)
  const [text, setText] = useState<Record<string, string> | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const deferred = useDeferredValue(query)
  const q = fold(deferred.trim())
  const hits = useMemo(() => (index && q ? rank(index, text, q) : []), [index, text, q])
  const showSheet = open && q.length > 0

  const ensureIndex = () => { if (!index) loadIndex().then(setIndex) }
  useEffect(() => { if (q && !text) loadText().then(setText) }, [q, text])
  useEffect(() => { setActive(0) }, [q])

  // "/" (when not typing) and ⌘K / Ctrl+K focus the field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing = !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      if ((e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault()
        loadIndex().then(setIndex)
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (showSheet) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, showSheet, listId])

  const go = (href: string) => {
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
    router.push(href)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Pinyin and other IMEs send Enter/arrows while composing; those belong to the IME.
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); if (hits.length) setActive((a) => (a + 1) % hits.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hits.length) setActive((a) => (a - 1 + hits.length) % hits.length) }
    else if (e.key === 'Enter') { const h = hits[active] ?? hits[0]; if (h) { e.preventDefault(); go(h.entry.href) } }
    else if (e.key === 'Escape') { if (showSheet) { e.preventDefault(); setOpen(false) } else { setQuery(''); inputRef.current?.blur() } }
  }

  return (
    <div
      className="search"
      role="search"
      ref={rootRef}
      data-has-query={query ? 'true' : undefined}
      onBlur={(e) => { if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false) }}
    >
      <div className="search-field">
        <label htmlFor="site-search" className="sr-only">搜索资料库</label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="搜索资料库"
          role="combobox"
          aria-expanded={showSheet}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showSheet && hits[active] ? `${listId}-${active}` : undefined}
          value={query}
          onFocus={() => { ensureIndex(); setOpen(true) }}
          onPointerEnter={ensureIndex}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="sr-only" aria-live="polite">
        {showSheet ? (index ? `${hits.length} 条结果` : '正在载入') : ''}
      </div>
      {showSheet && (
        <ul id={listId} className="search-sheet" role="listbox" aria-label="搜索结果" onMouseDown={(e) => e.preventDefault()}>
          {index === null && <li className="search-status">正在载入…</li>}
          {index !== null && hits.length === 0 && <li className="search-status">没有找到「{deferred.trim()}」</li>}
          {hits.map((h, i) => (
            <li
              key={h.entry.href}
              id={`${listId}-${i}`}
              className="search-result"
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
            >
              <Link
                href={h.entry.href}
                tabIndex={-1}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                  e.preventDefault()
                  go(h.entry.href)
                }}
              >
                {h.entry.section && <span className="search-result-section">{h.entry.section}</span>}
                <span className="search-result-title"><Mark text={h.entry.title} q={q} /></span>
                {h.snippet && <span className="search-result-snippet"><Mark text={h.snippet} q={q} /></span>}
              </Link>
            </li>
          ))}
          {index !== null && hits.length > 0 && !text && <li className="search-status">正在载入全文…</li>}
        </ul>
      )}
    </div>
  )
}
