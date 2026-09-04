import React from 'react'

const BOOK_REPO = 'https://github.com/transinacademia/tia-library'

export default function EditThisPageLink({ filePath }: { filePath?: string }) {
  if (!filePath) return null
  const href = `${BOOK_REPO}/edit/main/${filePath}`
  return (
    <p style={{marginTop: '1rem'}}>
      <a href={href} target="_blank" rel="noreferrer">在 GitHub 上编辑此页</a>
    </p>
  )
}
