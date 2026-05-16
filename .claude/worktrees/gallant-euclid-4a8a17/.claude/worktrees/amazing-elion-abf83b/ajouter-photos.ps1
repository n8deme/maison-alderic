# Script d'ajout automatique des photos Unsplash pour Maison Aldéric
# À exécuter depuis PowerShell dans : C:\Users\n8de.me\Documents\GitHub\maison-alderic

$PROJECT_ROOT = "C:\Users\n8de.me\Documents\GitHub\maison-alderic"

Write-Host "🚀 Ajout automatique des photos avocats - Maison Aldéric" -ForegroundColor Cyan
Write-Host ""

# ÉTAPE 1 : Créer lib/avocats-photos.ts
Write-Host "📝 Création de lib/avocats-photos.ts..." -ForegroundColor Yellow

$photosContent = @"
// Mapping des avocats avec leurs photos professionnelles Unsplash
// Ces URLs pointent vers des portraits professionnels optimisés (800x800px, crop=face)

export const AVOCATS_PHOTOS = {
  "alderic-vermeulen": "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&h=800&fit=crop&crop=face",
  "sophie-de-borchgrave": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop&crop=face",
  "jean-marc-petit": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop&crop=face",
  "anais-lambert": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=800&fit=crop&crop=face",
  "marc-dewinter": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop&crop=face",
  "claire-vandenberg": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop&crop=face",
  "thomas-lefebvre": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face",
  "julie-moreau": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=800&fit=crop&crop=face"
} as const;

export type AvocatSlug = keyof typeof AVOCATS_PHOTOS;

export function getAvocatPhoto(slug: string): string {
  return AVOCATS_PHOTOS[slug as AvocatSlug] || AVOCATS_PHOTOS["alderic-vermeulen"];
}
"@

Set-Content -Path "$PROJECT_ROOT\lib\avocats-photos.ts" -Value $photosContent -Encoding UTF8
Write-Host "✅ lib/avocats-photos.ts créé" -ForegroundColor Green

Write-Host ""
Write-Host "✅ TERMINÉ ! Photos Unsplash ajoutées au projet." -ForegroundColor Green
Write-Host ""
Write-Host "📋 PROCHAINES ÉTAPES :" -ForegroundColor Cyan
Write-Host "1. Ouvrir Cursor dans le projet Maison Aldéric" -ForegroundColor White
Write-Host "2. Demander à Claude de mettre à jour ces fichiers :" -ForegroundColor White
Write-Host "   - app/associes/page.tsx (grid 8 avocats)" -ForegroundColor Gray
Write-Host "   - app/associes/[slug]/page.tsx (hero photo avocat)" -ForegroundColor Gray
Write-Host "   - app/portail/rendez-vous/page.tsx (avatar avocat dans carte RDV)" -ForegroundColor Gray
Write-Host "   - components/portail/message-thread.tsx (avatar avocat dans messages)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Importer getAvocatPhoto() dans chaque fichier et remplacer les placeholders" -ForegroundColor White
Write-Host ""
