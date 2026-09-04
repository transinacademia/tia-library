import React from 'react'

export default function LangLayout({ children, params }: { children: React.ReactNode, params: { lang: string } }) {
  const lang = params.lang || 'zh'
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  )
}
