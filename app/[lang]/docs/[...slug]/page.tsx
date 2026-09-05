import { notFound } from 'next/navigation'
import { allDocs } from 'contentlayer/generated'
import DocRenderer, { headingsFromMarkdown } from '../../../../components/DocRenderer'
import TOC from '../../../../components/TOC'
import EditThisPageLink from '../../../../components/EditThisPageLink'

type Props = { params: { lang: string; slug: string[] } }

export function generateStaticParams() {
  return allDocs
    .filter((doc) => doc.slug.startsWith('docs/'))
    .map((doc) => ({ lang: 'zh', slug: doc.slug.slice('docs/'.length).split('/') }))
}

export default function DocPage({ params }: Props) {
  const slug = params.slug?.join('/') || ''
  const doc = allDocs.find((candidate) => candidate.slug === `docs/${slug}`)
  if (!doc) notFound()

  const headings = headingsFromMarkdown(doc.body.raw)
  return (
    <main className="doc-page">
      <div className="doc-content">
        <h1>{doc.title}</h1>
        <DocRenderer code={doc.body.code} />
        <EditThisPageLink filePath={`content.zh/${doc._raw.sourceFilePath}`} />
      </div>
      <TOC items={headings} />
    </main>
  )
}
