Param(
  [string]$source = 'content.zh',
  [string]$target = 'content'
)

# Copy source to target (preserve original)
if (Test-Path $target) { Write-Host "Target $target already exists. Exiting to avoid overwrite."; exit 1 }
Copy-Item -Recurse -Path $source -Destination $target

# Replace Hugo katex shortcodes with MDX component
Get-ChildItem -Path $target -Include *.md -Recurse | ForEach-Object {
  (Get-Content -Raw -Path $_.FullName) -replace '\{\{<\s*katex\s*>\}}', '<Katex>' -replace '\{\{<\s*/katex\s*>\}}', '</Katex>' | Set-Content -Path $_.FullName -Force
}

# Replace youtube shortcodes like {{< youtube id >}} -> <YouTubeEmbed id="id" />
Get-ChildItem -Path $target -Include *.md -Recurse | ForEach-Object {
  $text = Get-Content -Raw -Path $_.FullName
  $text = [System.Text.RegularExpressions.Regex]::Replace($text, '\{\{<\s*youtube\s+([^\s>]+)\s*>\}\}', '<YouTubeEmbed id="$1" />')
  Set-Content -Path $_.FullName -Value $text -Force
}

# Replace figure shortcode {{< figure src="..." caption="..." >}} -> <Figure src="..." caption="..." /> (basic)
Get-ChildItem -Path $target -Include *.md -Recurse | ForEach-Object {
  $text = Get-Content -Raw -Path $_.FullName
  $text = [System.Text.RegularExpressions.Regex]::Replace($text, '\{\{<\s*figure\s+(.*?)\s*>\}\}', { param($m)
    $attrs = $m.Groups[1].Value
    # naive attr parse: src="..." caption="..."
    $src = ([System.Text.RegularExpressions.Regex]::Match($attrs, 'src\s*=\s*"([^"]+)"')).Groups[1].Value
    $caption = ([System.Text.RegularExpressions.Regex]::Match($attrs, 'caption\s*=\s*"([^"]+)"')).Groups[1].Value
    return "<Figure src=\"$src\" caption=\"$caption\" />"
  })
  Set-Content -Path $_.FullName -Value $text -Force
}

Write-Host "Conversion complete. Converted content copied to $target." 
