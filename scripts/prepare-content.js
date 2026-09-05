const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const root = process.cwd()
const sourceDir = path.join(root, 'content.zh')
const contentDir = path.join(root, 'content')
const staticDir = path.join(root, 'static')
const publicDir = path.join(root, 'public')

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Missing content source directory: ${sourceDir}`)
}

fs.rmSync(contentDir, { recursive: true, force: true })
fs.cpSync(sourceDir, contentDir, { recursive: true })

for (const file of walk(contentDir)) {
  if (!file.endsWith('.md')) continue

  let text = fs.readFileSync(file, 'utf8')
  text = text
    .replace(/^type:\s*docs\s*\r?\n/m, '')
    .replace(/\{\{<\s*katex\s*>\}\}/g, '<Katex>')
    .replace(/\{\{<\s*\/katex\s*>\}\}/g, '</Katex>')
    .replace(/\{\{<\s*youtube\s+([^\s>]+)\s*>\}\}/g, '<YouTubeEmbed id="$1" />')
    .replace(/\{\{<\s*figure\s+(.*?)\s*>\}\}/g, (_match, attrs) => {
      const src = attrs.match(/src\s*=\s*"([^"]+)"/)?.[1] || ''
      const caption = attrs.match(/caption\s*=\s*"([^"]+)"/)?.[1] || ''
      return `<Figure src="${src}" caption="${caption}" />`
    })

  fs.writeFileSync(file, text, 'utf8')
}

if (fs.existsSync(staticDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
  copyDirectory(staticDir, publicDir)
}

execSync('npm run content:build', { cwd: root, stdio: 'inherit' })
execSync('npm run generate:search', { cwd: root, stdio: 'inherit' })

function* walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) yield* walk(file)
    else yield file
  }
}

function copyDirectory(source, target) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name)
    const targetPath = path.join(target, entry.name)
    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true })
      copyDirectory(sourcePath, targetPath)
    } else {
      fs.copyFileSync(sourcePath, targetPath)
    }
  }
}
