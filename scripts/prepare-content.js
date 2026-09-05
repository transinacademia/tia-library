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

  let text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n')
  text = liftLeadingHeading(text)
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

// The pages already render the document title as the page <h1>, but most source files
// repeat it as a leading `# ...` in the body — so every article printed its title twice.
// Strip that heading here. When its wording is richer than the frontmatter title (which
// stays short so it fits the sidebar), keep it as a separate `heading` field.
function liftLeadingHeading(text) {
  const parsed = /^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/.exec(text)
  if (!parsed) return text

  const [, open, frontmatter, close, body] = parsed
  const lines = body.split(/\r?\n/)
  const index = lines.findIndex((line) => line.trim() !== '')
  if (index === -1) return text

  const heading = /^#\s+(.+?)\s*$/.exec(lines[index])
  if (!heading) return text

  lines.splice(index, 1)
  while (lines.length && lines[0].trim() === '') lines.shift()

  const title = (/^title:\s*(.*)$/m.exec(frontmatter)?.[1] || '').trim().replace(/^["']|["']$/g, '')
  // Only paired emphasis is markup; a lone asterisk, as in 跨儿*, is part of the words.
  const plain = heading[1]
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(\*|_)(\S(?:.*?\S)?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .trim()

  // The body heading is kept only when it expands the title — "粉红清洗（Pinkwashing）" over
  // "粉红清洗". One that merely differs ("项目计划书" under "华语跨性别口述史项目计划书") is dropped
  // and the title serves as the page heading.
  const norm = (s) => s.replace(/^[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D\s]+/u, '').replace(/\s+/g, '')
  const expands = (h, t) =>
    h !== t && (h.includes(t) || ([...h].length > [...t].length && h.startsWith([...t].slice(0, 4).join(''))))

  const nextFrontmatter = plain && expands(norm(plain), norm(title))
    ? `${frontmatter}\nheading: "${plain.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
    : frontmatter

  return open + nextFrontmatter + close + lines.join('\n')
}

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
