Param(
  [string]$source = 'static',
  [string]$target = 'public'
)

if (-Not (Test-Path $source)) { Write-Host "Source $source not found. Exiting."; exit 0 }

# Create target if missing
if (-Not (Test-Path $target)) { New-Item -ItemType Directory -Path $target -Force }

Copy-Item -Path (Join-Path (Join-Path $PWD $source) '*') -Destination (Join-Path $PWD $target) -Recurse -Force
Write-Host "Copied static assets from $source to $target."