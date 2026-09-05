import React from 'react'
import Link from 'next/link'
import { allDocs } from 'contentlayer/generated'

type SidebarNode = {
  key: string
  doc?: (typeof allDocs)[number]
  children: SidebarNode[]
}

function hrefForDoc(slug: string) {
  const path = slug
    .replace(/^docs\//, '')
    .replace(/\/_index$/, '')
    .replace(/^_index$/, '')
  return `/zh/docs${path ? `/${path}` : ''}`
}

function buildSidebarTree(docs: (typeof allDocs)[number][]) {
  const nodes = new Map<string, SidebarNode>()
  const getNode = (key: string) => {
    let node = nodes.get(key)
    if (!node) {
      node = { key, children: [] }
      nodes.set(key, node)
    }
    return node
  }

  for (const doc of docs) {
    const relativeSlug = doc.slug.replace(/^docs\//, '')
    const isFolder = relativeSlug.endsWith('/_index')
    const key = isFolder
      ? relativeSlug.replace(/\/_index$/, '')
      : relativeSlug
    const node = getNode(key)
    node.doc = doc

    const parts = key.split('/')
    for (let i = 1; i < parts.length; i += 1) {
      getNode(parts.slice(0, i).join('/'))
    }
  }

  for (const node of nodes.values()) {
    const parentKey = node.key.includes('/')
      ? node.key.slice(0, node.key.lastIndexOf('/'))
      : ''
    if (parentKey) getNode(parentKey).children.push(node)
  }

  return [...nodes.values()]
    .filter((node) => !node.key.includes('/'))
    .sort((a, b) => a.key.localeCompare(b.key))
}

function renderNodes(nodes: SidebarNode[], onNavigate?: () => void): React.ReactNode {
  return nodes.map((node) => {
    const content = node.doc ? (
      <Link href={hrefForDoc(node.doc.slug)} onClick={onNavigate}>{node.doc.title}</Link>
    ) : (
      node.key.split('/').pop()
    )

    const children = [...node.children].sort((a, b) => a.key.localeCompare(b.key))
    return (
      <li key={node.key}>
        {children.length > 0 ? (
          <details className="sidebar-folder">
            <summary>{content}</summary>
            <ul>{renderNodes(children, onNavigate)}</ul>
          </details>
        ) : (
          content
        )}
      </li>
    )
  })
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const docs = allDocs
    .filter((doc) => doc.slug.startsWith('docs/') && doc.slug !== 'docs/_index')
  const tree = buildSidebarTree(docs)

  return (
    <nav aria-label="主导航">
      <h2>资料库</h2>
      <ul>
        <li><Link href="/zh/docs" onClick={onNavigate}>首页</Link></li>
        {renderNodes(tree, onNavigate)}
      </ul>
    </nav>
  )
}
