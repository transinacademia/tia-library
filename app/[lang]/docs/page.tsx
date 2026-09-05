import { notFound } from 'next/navigation'
import { allDocs } from 'contentlayer/generated'
import DocRenderer, { headingsFromMarkdown } from '../../../components/DocRenderer'
import TOC from '../../../components/TOC'
import EditThisPageLink from '../../../components/EditThisPageLink'

export function generateStaticParams() {
  return [{ lang: 'zh' }]
}

export default function DocsIndexPage({ params }: { params: { lang: string } }) {
  const doc = allDocs.find((candidate) => candidate.slug === '_index' || candidate.slug === 'docs/_index')
  if (!doc) notFound()
  return (
    <main className="doc-page">
      <div className="doc-content">
        <p className="eyebrow">TRANS IN ACADEMIA! LIBRARY</p>
        <h1>{doc.title}</h1>
        <DocRenderer code={doc.body.code} />
        <EditThisPageLink filePath={`content.zh/${doc._raw.sourceFilePath}`} />
      </div>
      <TOC items={headingsFromMarkdown(doc.body.raw)} />
    </main>
  )
}
