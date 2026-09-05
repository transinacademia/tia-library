'use client'

import React from 'react'
import '../styles/globals.scss'
import Sidebar from './Sidebar'
import Search from './Search'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const THEME_STORAGE_KEY = 'tia-library-theme'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    const preferredTheme: Theme = storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    document.documentElement.dataset.theme = preferredTheme
    setTheme(preferredTheme)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    setTheme(nextTheme)
  }

  useEffect(() => {
    if (!isMobileNavOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNavOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isMobileNavOpen])

  return (
    <div className="site-root">
      <header className="site-header">
        <Link className="brand" href="/">
          <span>Library</span>
        </Link>
        <button
          className="mobile-nav-toggle"
          type="button"
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-sidebar"
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          <span className="sr-only">{isMobileNavOpen ? '关闭' : '打开'}导航</span>
          <span aria-hidden="true">☰</span>
        </button>
        <Search />
        <button
          className="theme-toggle"
          type="button"
          aria-label="切换颜色主题"
          aria-pressed={theme === 'dark'}
          onClick={toggleTheme}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          <span>{theme === 'dark' ? '浅色模式' : '深色模式'}</span>
        </button>
      </header>
      <div className="site-body">
        <aside className="site-sidebar"><Sidebar /></aside>
        <div className="site-main">{children}</div>
      </div>
      {isMobileNavOpen && (
        <>
          <button
            className="mobile-nav-backdrop"
            type="button"
            aria-label="关闭导航"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside id="mobile-sidebar" className="mobile-sidebar" aria-label="移动端主导航">
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </>
      )}
      <footer className="site-footer">
        <span>© Trans in Academia!</span>
        <a href="https://github.com/transinacademia/tia-library" target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </div>
  )
}
