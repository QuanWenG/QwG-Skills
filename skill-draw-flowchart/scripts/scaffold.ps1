param(
  [Parameter(Mandatory = $false, Position = 0)]
  [string]$OutputPath = ".\flowchart-html",

  [switch]$Force
)

$ErrorActionPreference = "Stop"

$skillRoot = Split-Path -Parent $PSScriptRoot
$templateRoot = Join-Path $skillRoot "assets\template"
$targetRoot = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputPath)

if (-not (Test-Path -LiteralPath $templateRoot)) {
  throw "Template directory not found: $templateRoot"
}

if (Test-Path -LiteralPath $targetRoot) {
  $hasFiles = (Get-ChildItem -LiteralPath $targetRoot -Force | Select-Object -First 1) -ne $null
  if ($hasFiles -and -not $Force) {
    throw "Output directory already exists and is not empty: $targetRoot. Use -Force to overwrite matching template files."
  }
} else {
  New-Item -ItemType Directory -Path $targetRoot | Out-Null
}

$excludedDirs = @("node_modules", "dist", ".vite")

Get-ChildItem -LiteralPath $templateRoot -Force | ForEach-Object {
  if ($excludedDirs -contains $_.Name) {
    return
  }

  $destination = Join-Path $targetRoot $_.Name
  if ($_.PSIsContainer) {
    Copy-Item -LiteralPath $_.FullName -Destination $destination -Recurse -Force
  } else {
    Copy-Item -LiteralPath $_.FullName -Destination $destination -Force
  }
}

Write-Host "Flowchart HTML template copied to $targetRoot"
Write-Host "Next:"
Write-Host "  cd `"$targetRoot`""
Write-Host "  npm ci"
Write-Host "  npm run dev"

