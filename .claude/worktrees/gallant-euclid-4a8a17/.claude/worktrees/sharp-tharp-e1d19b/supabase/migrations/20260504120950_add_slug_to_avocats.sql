-- Ajouter colonne slug
ALTER TABLE public.avocats
ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Générer slugs depuis full_name pour les avocats existants
UPDATE public.avocats
SET slug = trim(both '-' from lower(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(full_name, '[àáâãäå]', 'a', 'g'),
            '[éèêë]', 'e', 'g'
          ),
          '[ìíîï]', 'i', 'g'
        ),
        '[òóôõö]', 'o', 'g'
      ),
      '[ùúûü]', 'u', 'g'
    ),
    '[^a-z0-9]+', '-', 'g'
  )
))
WHERE slug IS NULL;

-- Index pour performance
CREATE INDEX IF NOT EXISTS avocats_slug_idx ON public.avocats(slug);
