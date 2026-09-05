import React from 'react'

export default function TOC({ items }: { items: { id: string; text: string }[] }) {
  if (!items || items.length === 0) return null
  return (
    <nav className="toc" aria-label="本文目录">
      <h2>本文目录</h2>
      <ul>
        {items.map((it) => (
          <li key={it.id}><a href={`#${it.id}`}>{it.text}</a></li>
        ))}
      </ul>
    </nav>
  )
}
