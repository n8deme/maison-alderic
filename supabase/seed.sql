-- Mise a jour des avatars avocats (portraits Unsplash)
UPDATE avocats
SET avatar_url = CASE slug
  WHEN 'alderic-vermeulen' THEN 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&crop=faces'
  WHEN 'sophie-de-borchgrave' THEN 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces'
  WHEN 'jean-marc-petit' THEN 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces'
  WHEN 'anais-lambert' THEN 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=faces'
  WHEN 'marc-dewinter' THEN 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces'
  WHEN 'claire-vandenberg' THEN 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces'
  WHEN 'thomas-lefebvre' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces'
  WHEN 'julie-moreau' THEN 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=faces'
  ELSE avatar_url
END
WHERE slug IN (
  'alderic-vermeulen',
  'sophie-de-borchgrave',
  'jean-marc-petit',
  'anais-lambert',
  'marc-dewinter',
  'claire-vandenberg',
  'thomas-lefebvre',
  'julie-moreau'
);

-- Lier client@test.com a un client existant pour le portail
DO $$
DECLARE
  v_user_id uuid;
  v_source_client uuid;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'client@test.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'client@test.com introuvable dans auth.users';
    RETURN;
  END IF;

  -- Cas schema avec table public.clients
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'clients'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'clients' AND column_name = 'user_id'
    ) THEN
      EXECUTE $q$
        UPDATE public.clients
        SET user_id = (SELECT id FROM auth.users WHERE email = 'client@test.com' LIMIT 1)
        WHERE id = (SELECT id FROM public.clients LIMIT 1)
      $q$;
    ELSIF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'clients' AND column_name = 'profile_id'
    ) THEN
      UPDATE public.clients
      SET profile_id = v_user_id
      WHERE id = (SELECT id FROM public.clients LIMIT 1);
    ELSIF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'clients' AND column_name = 'owner_id'
    ) THEN
      UPDATE public.clients
      SET owner_id = v_user_id
      WHERE id = (SELECT id FROM public.clients LIMIT 1);
    END IF;
  END IF;

  -- Fallback du schema actuel: rattacher le portefeuille d'un client existant a client@test.com
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'dossiers' AND column_name = 'client_id'
  ) THEN
    SELECT client_id INTO v_source_client
    FROM public.dossiers
    WHERE client_id IS NOT NULL
      AND client_id <> v_user_id
    ORDER BY opened_at NULLS LAST
    LIMIT 1;

    IF v_source_client IS NOT NULL THEN
      UPDATE public.dossiers SET client_id = v_user_id WHERE client_id = v_source_client;
      UPDATE public.invoices SET client_id = v_user_id WHERE client_id = v_source_client;
      UPDATE public.appointments SET client_id = v_user_id WHERE client_id = v_source_client;
      UPDATE public.messages SET sender_id = v_user_id WHERE sender_type = 'client' AND sender_id = v_source_client;
    END IF;
  END IF;
END
$$;

-- Cohérence associées fondatrices
UPDATE avocats
SET
  is_founding_partner = true,
  title = 'Associée fondatrice'
WHERE slug = 'anais-lambert';

-- Seed profil complet pour client@test.com
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'client@test.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'client@test.com introuvable dans auth.users';
    RETURN;
  END IF;

  INSERT INTO profiles (id, email, full_name, company, phone, role)
  VALUES (
    v_user_id,
    'client@test.com',
    'Marc Dewinter',
    'TechScale BV',
    '+32 478 12 34 56',
    'client'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    company = EXCLUDED.company,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role;

  -- Aligner le dossier seed principal sur ce profil client
  UPDATE dossiers
  SET client_id = v_user_id
  WHERE reference = 'MA-2026-0010';
END
$$;
