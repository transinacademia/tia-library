import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="doc-page">
      <div className="doc-content">
        <p className="eyebrow">404</p>
        <h1>页面不存在</h1>
        <p className="lead">这个地址没有对应的页面，它可能已被移动、重命名或删除。</p>
        <p><Link href="/zh/docs">返回资料库首页</Link></p>
      </div>
    </main>
  )
}
