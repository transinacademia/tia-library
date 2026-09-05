// Writes two files into public/:
//   search-index.json  – one small record per doc: href, title, heading, section path,
//                        h2/h3 headings, and a short excerpt. Fetched when search gains focus.
//   search-text.json   – the plain-text body of every doc keyed by href. Fetched only once a
//                        query has been typed, and used for excerpts and body-only matches.
// Neither is pretty-printed; the old single file spent most of its 1.9 MB on indentation
// and on shipping raw markdown to every visitor on page load.
const fs = require('fs')
const path = require('path')

const root = process.cwd()
const generatedPath = path.join(root, '.contentlayer', 'generated', 'Doc', '_index.json')
const allDocs = JSON.parse(fs.readFileSync(generatedPath, 'utf8'))
const docs = allDocs.filter((d) => (d.slug || '').startsWith('docs/') && d.slug !== 'docs/_index')

const keyOf = (slug) => slug.replace(/^docs\//, '').replace(/\/_index$/, '')
const hrefOf = (slug) => `/zh/docs/${keyOf(slug)}`
const titleByKey = new Map(docs.filter((d) => d.slug.endsWith('/_index')).map((d) => [keyOf(d.slug), d.title]))
const sectionOf = (slug) => {
  const parts = keyOf(slug).split('/')
  parts.pop()
  return parts
    .map((_, i) => titleByKey.get(parts.slice(0, i + 1).join('/')) || '')
    .filter(Boolean)
    .join(' / ')
}

const plain = (md) =>
  md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>|]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim()

const index = docs.map((d) => {
  const raw = (d.body && d.body.raw) || ''
  const headings = [...raw.matchAll(/^#{2,3}\s+(.+?)\s*$/gm)].map((m) => m[1].replace(/[*_`]/g, '').trim())
  return {
    href: hrefOf(d.slug),
    title: d.title || '',
    ...(d.heading && d.heading !== d.title ? { heading: d.heading } : {}),
    section: sectionOf(d.slug),
    headings,
    excerpt: plain(raw).slice(0, 200),
  }
})
const text = Object.fromEntries(docs.map((d) => [hrefOf(d.slug), plain((d.body && d.body.raw) || '')]))

const outDir = path.join(root, 'public')
fs.mkdirSync(outDir, { recursive: true })
const indexPath = path.join(outDir, 'search-index.json')
const textPath = path.join(outDir, 'search-text.json')
fs.writeFileSync(indexPath, JSON.stringify(index), 'utf8')
fs.writeFileSync(textPath, JSON.stringify(text), 'utf8')

const kb = (p) => `${Math.round(fs.statSync(p).size / 1024)} KB`
console.log(`Wrote ${indexPath} (${kb(indexPath)}) and ${textPath} (${kb(textPath)})`)
