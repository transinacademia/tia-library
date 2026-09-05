import React from 'react'

import Katex from './Katex'
import YouTubeEmbed from './YouTubeEmbed'
import Figure from './Figure'
import GistEmbed from './GistEmbed'

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-')
const passthrough = (tag: keyof React.JSX.IntrinsicElements) => (props: any) => React.createElement(tag, props)
const components = {
  h1: ({ children, ...props }: any) => <h1 id={slugify(String(children))} {...props}>{children}</h1>,
  katex: ({ children }: any) => <Katex>{children}</Katex>,
  Katex: ({ children }: any) => <Katex>{children}</Katex>,
  youtube: ({ id }: any) => <YouTubeEmbed id={id} />,
  YouTubeEmbed: ({ id }: any) => <YouTubeEmbed id={id} />,
  figure: ({ src, alt, caption }: any) => <Figure src={src} alt={alt} caption={caption} />,
  Figure: ({ src, alt, caption }: any) => <Figure src={src} alt={alt} caption={caption} />,
  gist: ({ id }: any) => <GistEmbed id={id} />,
  GistEmbed: ({ id }: any) => <GistEmbed id={id} />,
  h2: ({ children, ...props }: any) => <h2 id={slugify(String(children))} {...props}>{children}</h2>,
  h3: ({ children, ...props }: any) => <h3 id={slugify(String(children))} {...props}>{children}</h3>,
  h4: passthrough('h4'), h5: passthrough('h5'), h6: passthrough('h6'),
  ul: passthrough('ul'), ol: passthrough('ol'), li: passthrough('li'),
  blockquote: passthrough('blockquote'), pre: passthrough('pre'), code: passthrough('code'),
  img: passthrough('img'), table: passthrough('table'), thead: passthrough('thead'),
  tbody: passthrough('tbody'), tr: passthrough('tr'), td: passthrough('td'), th: passthrough('th'),
  hr: passthrough('hr'), strong: passthrough('strong'), em: passthrough('em')
}

export function headingsFromMarkdown(markdown: string) {
  return markdown.split(/\r?\n/).flatMap((line) => {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (!match) return []
    const text = match[2].replace(/[*_`]/g, '')
    return [{ id: slugify(text), text }]
  })
}

export default function DocRenderer({ code }: { code: string }) {
  // Content is compiled during the trusted build by Contentlayer.
  const module = new Function('React', `${code}`)(React)
  const Component = (module.default || module) as React.ComponentType<any>
  return <Component components={components} />
}
