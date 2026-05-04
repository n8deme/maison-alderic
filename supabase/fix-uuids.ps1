# fix-uuids.ps1 — corrige les UUIDs avec prefixes non-hex dans les seeds _12 et _13

$dir = "$PSScriptRoot\migrations"
$files = @(
    "$dir\20260504121100_12_seed_public.sql",
    "$dir\20260504121200_13_seed_portail.sql"
)

# Map des remplacements : char invalide -> char hex valide
$rules = @(
    @{ from = 'i'; to = 'a' }   # insights       -> meme serie que avocat users (segment 4444 les differencie)
    @{ from = 'g'; to = 'c' }   # Hennin dossiers-> meme serie que clients (segment 5555 vs 2222)
    @{ from = 'h'; to = 'd' }   # Mertens dossier-> meme serie que deals (segment 5555 vs 3333)
    @{ from = 'j'; to = 'b' }   # DG dossiers    -> meme serie que avocats (segment 5555 vs 1111)
)

$hexTail = '[0-9a-fA-F]{7}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'

foreach ($file in $files) {
    $name = [System.IO.Path]::GetFileName($file)
    Write-Host ""
    Write-Host "=== $name ===" -ForegroundColor Cyan

    $text = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

    # -- SCAN : trouver tous les UUIDs dont le 1er char est non-hex (g-z) --
    $scanMatches = [regex]::Matches($text, "[g-zG-Z]$hexTail")
    $unique = $scanMatches | ForEach-Object { $_.Value } | Sort-Object -Unique

    if ($unique.Count -eq 0) {
        Write-Host "  OK - aucun UUID invalide" -ForegroundColor Green
        continue
    }

    foreach ($uuid in $unique) {
        $first = $uuid[0].ToString().ToLower()
        $rule  = $rules | Where-Object { $_.from -eq $first }
        $fixed = if ($rule) { $rule.to + $uuid.Substring(1) } else { '??? INCONNU' }
        Write-Host ("  {0}  ->  {1}" -f $uuid, $fixed) -ForegroundColor Yellow
    }

    # -- REPLACE --
    foreach ($rule in $rules) {
        $pattern = "$($rule.from)($hexTail)"
        $replace = $rule.to + '$1'
        $text = [regex]::Replace($text, $pattern, $replace)
    }

    [System.IO.File]::WriteAllText($file, $text, [System.Text.Encoding]::UTF8)
    Write-Host "  Sauvegarde OK" -ForegroundColor Green
}

Write-Host ""
Write-Host "Termine." -ForegroundColor Cyan
