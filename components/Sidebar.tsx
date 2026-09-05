import React from 'react'
import Link from 'next/link'

export default function Sidebar() {
  return (
    <nav aria-label="主导航">
      <h2>资料库</h2>
      <ul>
        <li><Link href="/zh/docs">首页</Link></li>
        <li><Link href="/zh/docs/about">关于我们</Link></li>
        <li><Link href="/zh/docs/original">原创</Link></li>
        <li><Link href="/zh/docs/repost">转载</Link></li>
        <li><Link href="/zh/docs/translated">译文</Link></li>
      </ul>
    </nav>
  )
}
