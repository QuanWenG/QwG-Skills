$ErrorActionPreference = 'Stop'

$templateRoot = Split-Path -Parent $PSScriptRoot
$root = (Resolve-Path -LiteralPath $templateRoot).Path

$devServer = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue |
  Select-Object -First 1
if ($devServer) {
  Stop-Process -Id $devServer.OwningProcess -Force -ErrorAction SilentlyContinue
}

$targets = @(
  'dist',
  'node_modules',
  'vite-dev.log',
  'vite-dev.err.log',
  'vite-preview.out.log',
  'vite-preview.err.log',
  'public/favicon.svg',
  'public/icons.svg',
  'src/assets/hero.png',
  'src/assets/react.svg',
  'src/assets/vite.svg'
)

foreach ($target in $targets) {
  $path = Join-Path $root $target
  if (-not (Test-Path -LiteralPath $path)) {
    continue
  }

  $resolved = (Resolve-Path -LiteralPath $path).Path
  if (-not $resolved.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove outside template root: $resolved"
  }

  Remove-Item -LiteralPath $resolved -Recurse -Force
}

$emptyDirs = @(
  'public',
  'src/assets'
)

foreach ($dir in $emptyDirs) {
  $path = Join-Path $root $dir
  if ((Test-Path -LiteralPath $path) -and -not (Get-ChildItem -LiteralPath $path -Force)) {
    Remove-Item -LiteralPath $path -Force
  }
}

Write-Host 'Template generated files removed.'
