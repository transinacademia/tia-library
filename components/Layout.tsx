import React from 'react'
import '../styles/globals.scss'
import Sidebar from './Sidebar'
import Search from './Search'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-root">
      <header className="site-header">
        <a href="/zh/docs/">Trans in Academia! Library</a>
        <Search />
      </header>
      <div className="site-body">
        <aside className="site-sidebar"><Sidebar /></aside>
        <article className="site-main">{children}</article>
      </div>
      <footer style={{padding: '1rem 2rem', borderTop: '1px solid #eee'}}>
        © Trans in Academia!
      </footer>
    </div>
  )
}
