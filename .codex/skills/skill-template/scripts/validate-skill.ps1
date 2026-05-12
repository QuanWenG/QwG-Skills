param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Path
)

$ErrorActionPreference = "Stop"

$skillPath = [System.IO.Path]::GetFullPath($Path)
$skillMd = Join-Path $skillPath "SKILL.md"
$openaiYaml = Join-Path $skillPath "agents\openai.yaml"
$errors = New-Object System.Collections.Generic.List[string]

if (-not (Test-Path -LiteralPath $skillPath -PathType Container)) {
  throw "Skill directory not found: $skillPath"
}

if (-not (Test-Path -LiteralPath $skillMd -PathType Leaf)) {
  $errors.Add("Missing SKILL.md")
} else {
  $content = Get-Content -LiteralPath $skillMd -Raw
  if ($content -notmatch '(?s)^---\s*\r?\n(.*?)\r?\n---') {
    $errors.Add("SKILL.md must start with YAML frontmatter delimited by ---")
  } else {
    $frontmatter = $Matches[1]
    if ($frontmatter -notmatch '(?m)^name:\s*([a-z0-9]+(?:-[a-z0-9]+)*)\s*$') {
      $errors.Add("SKILL.md frontmatter must include a valid lowercase hyphen-case name")
    } else {
      $declaredName = $Matches[1]
      $folderName = Split-Path -Leaf $skillPath
      if ($declaredName -ne $folderName) {
        $errors.Add("SKILL.md name '$declaredName' must match folder name '$folderName'")
      }
    }
    if ($frontmatter -notmatch '(?m)^description:\s*\S.+$') {
      $errors.Add("SKILL.md frontmatter must include a non-empty description")
    }
  }
}

if (-not (Test-Path -LiteralPath $openaiYaml -PathType Leaf)) {
  $errors.Add("Missing agents/openai.yaml")
}

foreach ($dir in @("references", "scripts", "assets")) {
  $dirPath = Join-Path $skillPath $dir
  if (-not (Test-Path -LiteralPath $dirPath -PathType Container)) {
    $errors.Add("Missing optional standard directory: $dir")
  }
}

if ($errors.Count -gt 0) {
  Write-Host "Skill validation failed:" -ForegroundColor Red
  foreach ($errorItem in $errors) {
    Write-Host "  - $errorItem" -ForegroundColor Red
  }
  exit 1
}

Write-Host "Skill validation passed: $skillPath" -ForegroundColor Green
