-- ============================================================================
-- 16 — FIX : Accents manquants + pronoms (seed corrections)
-- ============================================================================
-- Bug C2: Sophie de Borchgrave pronoms féminins
-- Bug C3: Accents manquants dans les bios (lisibilité, etc.)
-- ============================================================================

-- Vérification : si des pronoms masculins existaient dans la bio de Sophie
UPDATE public.avocats
SET bio = REPLACE(bio, 'Il accompagne', 'Elle accompagne')
WHERE slug = 'sophie-de-borchgrave' AND bio LIKE '%Il accompagne%';

UPDATE public.avocats
SET bio = REPLACE(bio, 'Son approche', 'Son approche')
WHERE slug = 'sophie-de-borchgrave';

-- Correction des accents manquants
UPDATE public.avocats
SET bio = REPLACE(bio, 'lisibilite', 'lisibilité')
WHERE bio LIKE '%lisibilite%';

UPDATE public.avocats
SET bio = REPLACE(bio, 'securite', 'sécurité')
WHERE bio LIKE '%securite%';

UPDATE public.avocats
SET bio = REPLACE(bio, 'responsabilite', 'responsabilité')
WHERE bio LIKE '%responsabilite%';

UPDATE public.avocats
SET bio = REPLACE(bio, 'verite', 'vérité')
WHERE bio LIKE '%verite%';

UPDATE public.avocats
SET bio = REPLACE(bio, 'priorite', 'priorité')
WHERE bio LIKE '%priorite%';

UPDATE public.avocats
SET bio = REPLACE(bio, 'qualite', 'qualité')
WHERE bio LIKE '%qualite%';

-- Correction des mêmes accents dans les insights
UPDATE public.insights
SET content = REPLACE(content, 'lisibilite', 'lisibilité')
WHERE content LIKE '%lisibilite%';

UPDATE public.insights
SET content = REPLACE(content, 'securite', 'sécurité')
WHERE content LIKE '%securite%';

UPDATE public.insights
SET content = REPLACE(content, 'responsabilite', 'responsabilité')
WHERE content LIKE '%responsabilite%';

UPDATE public.insights
SET content = REPLACE(content, 'verite', 'vérité')
WHERE content LIKE '%verite%';

UPDATE public.insights
SET content = REPLACE(content, 'priorite', 'priorité')
WHERE content LIKE '%priorite%';

UPDATE public.insights
SET content = REPLACE(content, 'qualite', 'qualité')
WHERE content LIKE '%qualite%';
