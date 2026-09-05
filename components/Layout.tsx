import React from 'react'
import '../styles/globals.scss'
import Sidebar from './Sidebar'
import Search from './Search'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-root">
      <header className="site-header">
        <Link className="brand" href="/">Trans in Academia! <span>Library</span></Link>
        <Search />
      </header>
      <div className="site-body">
        <aside className="site-sidebar"><Sidebar /></aside>
        <div className="site-main">{children}</div>
      </div>
      <footer className="site-footer">
        <span>© Trans in Academia!</span>
        <a href="https://github.com/transinacademia/tia-library" target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </div>
  )
}
