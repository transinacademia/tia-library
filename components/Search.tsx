import React, { useEffect, useState } from 'react'

type Doc = { slug: string; title: string; body: string }

export default function Search() {
  const [index, setIndex] = useState<Doc[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Doc[]>([])

  useEffect(() => {
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((data) => setIndex(data))
      .catch(() => setIndex([]))
  }, [])

  useEffect(() => {
    if (!query) { setResults([]); return }
    const q = query.toLowerCase()
    const res = index.filter(d => (d.title + ' ' + (d.body || '')).toLowerCase().includes(q)).slice(0, 20)
    setResults(res)
  }, [query, index])

  return (
    <div>
      <input placeholder="搜索" value={query} onChange={e => setQuery(e.target.value)} />
      <ul>
        {results.map(r => (
          <li key={r.slug}><a href={`/${r.slug}`}>{r.title}</a></li>
        ))}
      </ul>
    </div>
  )
}
