import React from 'react'
import Link from 'next/link'
import { allDocs } from 'contentlayer/generated'

function hrefForDoc(slug: string) {
  const path = slug
    .replace(/^docs\//, '')
    .replace(/\/_index$/, '')
    .replace(/^_index$/, '')
  return `/zh/docs${path ? `/${path}` : ''}`
}

export default function Sidebar() {
  const docs = allDocs
    .filter((doc) => doc.slug.startsWith('docs/') && doc.slug !== 'docs/_index')
    .sort((a, b) => a.slug.localeCompare(b.slug))

  return (
    <nav aria-label="主导航">
      <h2>资料库</h2>
      <ul>
        <li><Link href="/zh/docs">首页</Link></li>
        {docs.map((doc) => {
          const depth = doc.slug.replace(/^docs\//, '').split('/').length
          return (
            <li key={doc.slug} style={{ marginLeft: `${(depth - 1) * 0.75}rem` }}>
              <Link href={hrefForDoc(doc.slug)}>{doc.title}</Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
