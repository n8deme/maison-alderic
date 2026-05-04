# ============================================================
# scan-and-fix-uuids.ps1
# Scanne _12 et _13 pour les UUIDs invalides, les liste,
# puis applique les remplacements.
# ============================================================

$files = @(
  "supabase\migrations\20260504121100_12_seed_public.sql",
  "supabase\migrations\20260504121200_13_seed_portail.sql"
)

# Regex UUID-shaped : accepte n'importe quelle lettre pour attraper les invalides
$uuidRx = '[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}'
$validRx = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'

# Mappings : caractère invalide -> remplacement (uniquement en 1re position du 1er segment)
$replacements = [ordered]@{
  # _12 : insights i -> a
  'i([0-9a-f]{7}-4444-4444-8444-[0-9a-f]{12})' = 'a$1'
  # _13 : Hennin  g -> c
  'g([0-9a-f]{7}-5555-4555-8555-[0-9a-f]{12})' = 'c$1'
  # _13 : Mertens h -> d
  'h([0-9a-f]{7}-5555-4555-8555-[0-9a-f]{12})' = 'd$1'
  # _13 : DG      j -> b
  'j([0-9a-f]{7}-5555-4555-8555-[0-9a-f]{12})' = 'b$1'
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  PHASE 1 — SCAN : UUIDs invalides détectés       ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan

$totalInvalid = 0
foreach ($file in $files) {
  Write-Host ""
  Write-Host "── $file" -ForegroundColor Yellow
  $content = Get-Content $file -Raw -Encoding UTF8
  $matches = [regex]::Matches($content, $uuidRx)
  $seen = @{}
  foreach ($m in $matches) {
    $uuid = $m.Value
    if ($uuid -notmatch $validRx -and -not $seen[$uuid]) {
      # Déterminer le remplacement prévu
      $planned = $uuid
      foreach ($pattern in $replacements.Keys) {
        if ($uuid -match $pattern) {
          $planned = [regex]::Replace($uuid, $pattern, $replacements[$pattern])
          break
        }
      }
      $color = if ($planned -eq $uuid) { 'Red' } else { 'Magenta' }
      Write-Host "  INVALIDE : $uuid  ->  $planned" -ForegroundColor $color
      $seen[$uuid] = $true
      $totalInvalid++
    }
  }
  if ($seen.Count -eq 0) { Write-Host "  (aucun UUID invalide)" -ForegroundColor Green }
}

Write-Host ""
Write-Host "Total UUIDs invalides uniques : $totalInvalid" -ForegroundColor $(if ($totalInvalid -eq 0) { 'Green' } else { 'Magenta' })

if ($totalInvalid -eq 0) {
  Write-Host "Rien a corriger." -ForegroundColor Green
  exit 0
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  PHASE 2 — REMPLACEMENT                          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan

foreach ($file in $files) {
  $content = Get-Content $file -Raw -Encoding UTF8
  $original = $content
  foreach ($pattern in $replacements.Keys) {
    $content = [regex]::Replace($content, $pattern, $replacements[$pattern])
  }
  if ($content -ne $original) {
    [System.IO.File]::WriteAllText((Resolve-Path $file).Path, $content, [System.Text.Encoding]::UTF8)
    Write-Host "  CORRIGE : $file" -ForegroundColor Green
  } else {
    Write-Host "  (inchange) : $file" -ForegroundColor Gray
  }
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  PHASE 3 — VERIFICATION POST-CORRECTION          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan

$remaining = 0
foreach ($file in $files) {
  $content = Get-Content $file -Raw -Encoding UTF8
  $matches = [regex]::Matches($content, $uuidRx)
  $seen = @{}
  foreach ($m in $matches) {
    $uuid = $m.Value
    if ($uuid -notmatch $validRx -and -not $seen[$uuid]) {
      Write-Host "  ENCORE INVALIDE : $uuid  dans $file" -ForegroundColor Red
      $seen[$uuid] = $true
      $remaining++
    }
  }
}
if ($remaining -eq 0) {
  Write-Host "  OK — Aucun UUID invalide restant." -ForegroundColor Green
}
Write-Host ""