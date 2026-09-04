import React from 'react'

export default function Katex({ children }: { children: React.ReactNode }) {
  // Placeholder: replace with proper katex rendering (rehype-katex or react-katex) once deps installed
  return <span className="katex-inline" dangerouslySetInnerHTML={{ __html: String(children) }} />
}
