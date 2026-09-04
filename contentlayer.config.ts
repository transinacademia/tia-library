import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: '**/*.md',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: false },
    type: { type: 'string', required: false }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath
    }
  }
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Doc]
})
