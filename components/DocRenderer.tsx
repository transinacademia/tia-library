import React from 'react'
import { MDXProvider } from '@mdx-js/react'

import Katex from './Katex'
import YouTubeEmbed from './YouTubeEmbed'
import Figure from './Figure'
import GistEmbed from './GistEmbed'

const components = {
  katex: ({ children }: any) => <Katex>{children}</Katex>,
  youtube: ({ id }: any) => <YouTubeEmbed id={id} />,
  figure: ({ src, alt, caption }: any) => <Figure src={src} alt={alt} caption={caption} />,
  gist: ({ id }: any) => <GistEmbed id={id} />
}

export default function DocRenderer({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
