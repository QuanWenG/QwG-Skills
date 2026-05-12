param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Name,

  [Parameter(Mandatory = $false, Position = 1)]
  [string]$OutputParent = (Get-Location).Path
)

$ErrorActionPreference = "Stop"

if ($Name -notmatch '^[a-z0-9]+(-[a-z0-9]+)*$') {
  throw "Invalid skill name '$Name'. Use lowercase letters, digits, and hyphens only, for example 'my-skill'."
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$skillDir = Split-Path -Parent $scriptDir
$skeletonDir = Join-Path $skillDir "assets\skill-skeleton"

if (-not (Test-Path -LiteralPath $skeletonDir -PathType Container)) {
  throw "Skeleton directory not found: $skeletonDir"
}

$parentPath = [System.IO.Path]::GetFullPath($OutputParent)
$targetDir = Join-Path $parentPath $Name

if (Test-Path -LiteralPath $targetDir) {
  $existing = Get-ChildItem -LiteralPath $targetDir -Force
  if ($existing.Count -gt 0) {
    throw "Target directory already exists and is not empty: $targetDir"
  }
} else {
  New-Item -ItemType Directory -Path $targetDir | Out-Null
}

Get-ChildItem -LiteralPath $skeletonDir -Force | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $targetDir -Recurse -Force
}

$displayName = ($Name -split '-' | ForEach-Object {
  if ($_.Length -eq 0) { $_ } else { $_.Substring(0, 1).ToUpperInvariant() + $_.Substring(1) }
}) -join ' '

$replacements = @{
  "{{SKILL_NAME}}" = $Name
  "{{DISPLAY_NAME}}" = $displayName
}

Get-ChildItem -LiteralPath $targetDir -Recurse -File | ForEach-Object {
  $content = Get-Content -LiteralPath $_.FullName -Raw
  foreach ($key in $replacements.Keys) {
    $content = $content.Replace($key, $replacements[$key])
  }
  Set-Content -LiteralPath $_.FullName -Value $content -NoNewline
}

Write-Host "Created skill: $targetDir"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Edit SKILL.md description."
Write-Host "  2. Add references, scripts, or assets only when needed."
Write-Host "  3. Run scripts\validate-skill.ps1 $targetDir"
