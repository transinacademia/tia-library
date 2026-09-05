import React from 'react'

type Props = { params: { lang: string; slug: string[] } }

export default async function DocPage({ params }: Props) {
  const slug = params.slug?.join('/') || ''

  try {
    const gen = await import('../../../../.contentlayer/generated')
    const allDocs = (gen as any).allDoc || (gen as any).allDocs || []
    const doc = allDocs.find((d: any) => d.slug === slug || d._raw?.flattenedPath === slug)
    if (!doc) {
      return (
        <main style={{padding: '2rem'}}>
          <h1>文档未找到</h1>
          <p>无法在构建时找到与路径匹配的文档: {slug}</p>
        </main>
      )
    }
    return (
      <main style={{padding: '2rem'}}>
        <h1>{doc.title}</h1>
        <div>
          {/* Contentlayer MDX rendering will be wired during migration. */}
          <pre style={{whiteSpace: 'pre-wrap'}}>{(doc.body as any) || doc._raw?.sourceFilePath}</pre>
        </div>
      </main>
    )
  } catch (e) {
    return (
      <main style={{padding: '2rem'}}>
        <h1>文档预览</h1>
        <p>Contentlayer 未生成。请在本地或 CI 中安装依赖并运行构建以生成内容。</p>
        <p>Requested slug: {slug}</p>
      </main>
    )
  }
}
