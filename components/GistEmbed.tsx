import React from 'react'

export default function GistEmbed({ id }: { id: string }) {
  // Simple script-based embed — better to server-render or use npm gist-embed when available
  return (
    <div>
      <script src={`https://gist.github.com/${id}.js`}></script>
      <noscript>Gist: {id}</noscript>
    </div>
  )
}
