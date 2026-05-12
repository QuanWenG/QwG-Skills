$ErrorActionPreference = 'Stop'

$templateRoot = Split-Path -Parent $PSScriptRoot
Set-Location $templateRoot

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw 'npm was not found. Install Node.js before preparing this template.'
}

npm ci

Write-Host ''
Write-Host 'Template dependencies are ready.'
Write-Host 'Run npm run dev to start the local editor.'
