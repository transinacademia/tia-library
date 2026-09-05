import React from 'react'
import { allDocs } from 'contentlayer/generated'
import SidebarTree, { type NavNode } from './SidebarTree'

// Server component: the only file that touches allDocs (7.5 MB with compiled bodies).
// It hands the client tree a few KB of { title, href, children } and nothing else.

type Doc = (typeof allDocs)[number]
type Draft = { key: string; doc?: Doc; children: Map<string, Draft> }

const keyOf = (slug: string) => slug.replace(/^docs\//, '').replace(/\/_index$/, '')
const hrefOf = (key: string) => `/zh/docs${key ? `/${key}` : ''}`

function buildTree(docs: Doc[]): NavNode[] {
  const root: Draft = { key: '', children: new Map() }
  const draftFor = (key: string) =>
    key.split('/').reduce((parent, _part, i, parts) => {
      const k = parts.slice(0, i + 1).join('/')
      let node = parent.children.get(k)
      if (!node) {
        node = { key: k, children: new Map() }
        parent.children.set(k, node)
      }
      return node
    }, root)
  for (const doc of docs) draftFor(keyOf(doc.slug)).doc = doc

  // Hugo `weight` first (the order the editors wrote for), then slug.
  const weight = (d: Draft) => (typeof d.doc?.weight === 'number' ? d.doc.weight : Number.POSITIVE_INFINITY)
  const toNode = (d: Draft): NavNode => ({
    title: (d.doc?.title ?? d.key.split('/').pop() ?? '').trim(),
    href: hrefOf(d.key),
    children: [...d.children.values()]
      .sort((a, b) => weight(a) - weight(b) || a.key.localeCompare(b.key))
      .map(toNode),
  })
  return toNode(root).children
}

export default function Sidebar() {
  const docs = allDocs.filter((doc) => doc.slug.startsWith('docs/') && doc.slug !== 'docs/_index')
  return <SidebarTree tree={buildTree(docs)} />
}
