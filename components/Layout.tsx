import React from 'react'
import '../styles/globals.scss'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-root">
      <header style={{padding: '1rem 2rem', borderBottom: '1px solid #eee'}}>
        <a href="/">Trans in Academia! Library</a>
      </header>
      <div style={{display: 'flex'}}>
        <aside style={{width: 280, padding: '1rem 1rem', borderRight: '1px solid #f0f0f0'}}>
          {/* Sidebar / navigation will go here */}
        </aside>
        <article style={{flex: 1, padding: '1rem 2rem'}}>{children}</article>
      </div>
      <footer style={{padding: '1rem 2rem', borderTop: '1px solid #eee'}}>
        © Trans in Academia!
      </footer>
    </div>
  )
}
