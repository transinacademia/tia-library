import { notFound } from 'next/navigation'
import { allDocs } from 'contentlayer/generated'
import DocRenderer, { headingsFromMarkdown } from '../../../../components/DocRenderer'
import TOC from '../../../../components/TOC'
import EditThisPageLink from '../../../../components/EditThisPageLink'

type Props = { params: { lang: string; slug: string[] } }

export function generateStaticParams() {
  return allDocs
    .filter((doc) => doc.slug.startsWith('docs/') && doc.slug !== 'docs/_index')
    .map((doc) => {
      const path = doc.slug.slice('docs/'.length)
      return { lang: 'zh', slug: path.endsWith('/_index') ? path.slice(0, -('/_index'.length)).split('/') : path.split('/') }
    })
}

export default function DocPage({ params }: Props) {
  const slug = params.slug?.join('/') || ''
  const doc = allDocs.find((candidate) =>
    candidate.slug === `docs/${slug}` || candidate.slug === `docs/${slug}/_index`
  )
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
