-- Met à jour Anaïs Lambert en tant qu'associée fondatrice
UPDATE public.avocats 
SET 
  title = 'Associée fondatrice',
  is_founding_partner = true
WHERE slug = 'anais-lambert';