import React from 'react'

export default function TOC({ items }: { items: { id: string; text: string }[] }) {
  if (!items || items.length === 0) return null
  return (
    <nav aria-label="Table of contents">
      <h4>目录</h4>
      <ul>
        {items.map((it) => (
          <li key={it.id}><a href={`#${it.id}`}>{it.text}</a></li>
        ))}
      </ul>
    </nav>
  )
}
