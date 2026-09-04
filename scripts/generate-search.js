(async () => {
  try {
    // Try to import contentlayer generated data
    const gen = await import('contentlayer/generated')
    const allDocs = gen.allDoc || gen.allDocs || gen.all || []

    const docs = (allDocs || []).map(d => ({
      slug: d.slug || (d._raw && d._raw.flattenedPath) || d._id || '',
      title: d.title || '',
      body: d.body || d.excerpt || ''
    }))

    const fs = await import('fs')
    const path = await import('path')
    const outDir = path.join(process.cwd(), 'public')
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
    const outPath = path.join(outDir, 'search-index.json')
    fs.writeFileSync(outPath, JSON.stringify(docs, null, 2), 'utf8')
    console.log('Wrote search index to', outPath)
  } catch (e) {
    console.error('Failed to generate search index:', e)
    process.exit(1)
  }
})()
