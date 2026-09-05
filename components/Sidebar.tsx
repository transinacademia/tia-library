import React from 'react'

export default function Sidebar() {
  return (
    <nav aria-label="主导航">
      <h2>目录</h2>
      <ul>
        <li><a href="/zh/docs/about/_index">关于我们</a></li>
        <li><a href="/zh/docs/original/_index">原创</a></li>
        <li><a href="/zh/docs/repost/_index">转载</a></li>
        <li><a href="/zh/docs/translated/_index">译文</a></li>
      </ul>
    </nav>
  )
}
