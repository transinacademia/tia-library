'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

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
    <div className="search" role="search">
      <label htmlFor="site-search" className="sr-only">搜索文档</label>
      <input id="site-search" type="search" placeholder="搜索资料库" value={query} onChange={e => setQuery(e.target.value)} />
      {query && <ul className="search-results" aria-label="搜索结果">
        {results.length ? results.map(r => {
          const path = r.slug.replace(/^docs\//, '').replace(/\/_index$/, '').replace(/^_index$/, '')
          return <li key={r.slug}><Link href={`/zh/docs${path ? `/${path}` : ''}`}>{r.title}</Link></li>
        }) : <li className="search-empty">没有找到匹配内容</li>}
      </ul>}
    </div>
  )
}
