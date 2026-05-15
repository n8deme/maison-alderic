// Mapping avocat slug → portrait Unsplash professionnel (800×800, crop=face)
// Slugs alignés sur les valeurs réelles en DB (table public.avocats, colonne slug)

export const AVOCATS_PHOTOS = {
  // Associés fondateurs
  "alderic-vermeulen":    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&h=800&fit=crop&crop=face",
  "sophie-de-borchgrave": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop&crop=face",
  "jean-marc-petit":      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop&crop=face",
  "anais-lambert":        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=800&fit=crop&crop=face",

  // Counsels & Senior Associates
  "marc-dewinter":        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop&crop=face",
  "lea-brouwers":         "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop&crop=face",
  "olivier-maertens":     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face",
  "camilla-janssens":     "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=800&fit=crop&crop=face",
} as const;

export type AvocatSlug = keyof typeof AVOCATS_PHOTOS;

export function getAvocatPhoto(slug: string): string {
  return AVOCATS_PHOTOS[slug as AvocatSlug] ?? AVOCATS_PHOTOS["alderic-vermeulen"];
}
