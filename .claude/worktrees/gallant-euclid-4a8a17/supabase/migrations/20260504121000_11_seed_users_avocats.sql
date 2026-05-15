-- ============================================================================
-- 11 — SEED : USERS (auth.users) + AVOCATS
-- ============================================================================
-- 8 avocats internes + 5 clients fictifs.
-- UUIDs hardcodés pour permettre les cross-references dans les autres seeds.
-- Emails au format kev+<slug>@n8de.me (alias Gmail/n8de.me).
-- Passwords forts listés dans supabase/SEED_CREDENTIALS.md (gitignored).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helper : créer un user auth confirmé en une fonction
-- ----------------------------------------------------------------------------
create or replace function private.seed_create_user(
  p_id          uuid,
  p_email       text,
  p_password    text,
  p_full_name   text,
  p_role        text,
  p_company     text default null,
  p_phone       text default null
) returns void
language plpgsql
security definer
as $func$
declare
  v_meta jsonb;
begin
  v_meta := jsonb_build_object('full_name', p_full_name, 'role', p_role);
  if p_company is not null then v_meta := v_meta || jsonb_build_object('company', p_company); end if;
  if p_phone   is not null then v_meta := v_meta || jsonb_build_object('phone', p_phone); end if;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000',
    p_id,
    'authenticated', 'authenticated',
    p_email,
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    v_meta,
    now(), now(),
    '', '', '', ''
  )
  on conflict (id) do nothing;

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider,
    created_at, updated_at, last_sign_in_at
  ) values (
    gen_random_uuid(),
    p_id,
    p_id::text,
    jsonb_build_object('sub', p_id::text, 'email', p_email, 'email_verified', true),
    'email',
    now(), now(), now()
  )
  on conflict do nothing;
end;
$func$;

-- ----------------------------------------------------------------------------
-- 8 AVOCATS — auth.users
-- ----------------------------------------------------------------------------
-- Associés fondateurs
select private.seed_create_user(
  'a0000001-1111-4111-8111-000000000001'::uuid,
  'kev+alderic-vermeulen@n8de.me',
  'MA2026!Vermeulen-Kp7n',
  'Aldéric Vermeulen', 'avocat', null, '+32 2 234 56 01'
);
select private.seed_create_user(
  'a0000002-1111-4111-8111-000000000002'::uuid,
  'kev+sophie-borchgrave@n8de.me',
  'MA2026!Borchgrave-Hj4m',
  'Sophie de Borchgrave', 'avocat', null, '+32 2 234 56 02'
);
select private.seed_create_user(
  'a0000003-1111-4111-8111-000000000003'::uuid,
  'kev+jean-marc-petit@n8de.me',
  'MA2026!Petit-Vt9q',
  'Jean-Marc Petit', 'avocat', null, '+32 2 234 56 03'
);
select private.seed_create_user(
  'a0000004-1111-4111-8111-000000000004'::uuid,
  'kev+anais-lambert@n8de.me',
  'MA2026!Lambert-Bz3x',
  'Anaïs Lambert', 'avocat', null, '+32 2 234 56 04'
);

-- Counsels & Senior Associates
select private.seed_create_user(
  'a0000005-1111-4111-8111-000000000005'::uuid,
  'kev+marc-dewinter@n8de.me',
  'MA2026!Dewinter-Pn5r',
  'Marc Dewinter', 'avocat', null, '+32 2 234 56 05'
);
select private.seed_create_user(
  'a0000006-1111-4111-8111-000000000006'::uuid,
  'kev+lea-brouwers@n8de.me',
  'MA2026!Brouwers-Mk8w',
  'Léa Brouwers', 'avocat', null, '+32 2 234 56 06'
);
select private.seed_create_user(
  'a0000007-1111-4111-8111-000000000007'::uuid,
  'kev+olivier-maertens@n8de.me',
  'MA2026!Maertens-Yc2f',
  'Olivier Maertens', 'avocat', null, '+32 2 234 56 07'
);
select private.seed_create_user(
  'a0000008-1111-4111-8111-000000000008'::uuid,
  'kev+camille-janssens@n8de.me',
  'MA2026!Janssens-Lr6t',
  'Camille Janssens', 'avocat', null, '+32 2 234 56 08'
);

-- ----------------------------------------------------------------------------
-- 5 CLIENTS FICTIFS — auth.users
-- ----------------------------------------------------------------------------
select private.seed_create_user(
  'c0000001-2222-4222-8222-000000000001'::uuid,
  'kev+client-techscale@n8de.me',
  'MA2026!TechScale-Hx9n',
  'Élise Vandenbroucke', 'client', 'TechScale BV', '+32 471 12 34 56'
);
select private.seed_create_user(
  'c0000002-2222-4222-8222-000000000002'::uuid,
  'kev+client-industrial@n8de.me',
  'MA2026!Industrial-Vp3k',
  'Pierre Vandenberghe', 'client', 'Belgian Industrial Holding', '+32 478 23 45 67'
);
select private.seed_create_user(
  'c0000003-2222-4222-8222-000000000003'::uuid,
  'kev+client-family@n8de.me',
  'MA2026!Family-Wm5b',
  'Christine de Hennin', 'client', 'Family Office Hennin', '+32 475 34 56 78'
);
select private.seed_create_user(
  'c0000004-2222-4222-8222-000000000004'::uuid,
  'kev+client-entrepreneur@n8de.me',
  'MA2026!Entrep-Qj7y',
  'Thomas Mertens', 'client', 'Mertens Capital', '+32 472 45 67 89'
);
select private.seed_create_user(
  'c0000005-2222-4222-8222-000000000005'::uuid,
  'kev+client-juridique@n8de.me',
  'MA2026!Legal-Rz4s',
  'Caroline Dubois', 'client', 'Distribution Group SA', '+32 476 56 78 90'
);

-- ----------------------------------------------------------------------------
-- AVOCATS — table public.avocats (lien via user_id)
-- ----------------------------------------------------------------------------
insert into public.avocats (
  id, user_id, slug, full_name, title, expertises, email, phone,
  bio, bar_admission, languages, is_founding_partner, display_order
) values
(
  'b0000001-1111-4111-8111-000000000001',
  'a0000001-1111-4111-8111-000000000001',
  'alderic-vermeulen',
  'Aldéric Vermeulen',
  'Associé fondateur',
  array['M&A', 'Private Equity', 'Corporate'],
  'a.vermeulen@maison-alderic.be',
  '+32 2 234 56 01',
  'Aldéric Vermeulen est associé fondateur de Maison Aldéric & Associés. Spécialiste reconnu des opérations de fusions-acquisitions transfrontalières, il a conseillé plus de 80 transactions M&A pour un montant cumulé dépassant 8 milliards d''euros depuis 2003. Avant de fonder le cabinet, il a exercé chez Stibbe et chez Cleary Gottlieb à Bruxelles. Il enseigne le droit des sociétés à l''ULB depuis 2012.',
  'Barreau de Bruxelles, 1995',
  array['FR', 'NL', 'EN', 'DE'],
  true,
  1
),
(
  'b0000002-1111-4111-8111-000000000002',
  'a0000002-1111-4111-8111-000000000002',
  'sophie-de-borchgrave',
  'Sophie de Borchgrave',
  'Associée fondatrice',
  array['Litigation', 'Arbitrage international', 'Contentieux des affaires'],
  's.deborchgrave@maison-alderic.be',
  '+32 2 234 56 02',
  'Sophie de Borchgrave dirige le département Contentieux des affaires de Maison Aldéric. Elle plaide devant les juridictions belges et européennes ainsi que devant les tribunaux arbitraux ICC, LCIA et CEPANI. Elle est régulièrement classée parmi les meilleures avocates en contentieux commercial belge par Chambers Europe et Legal 500. Elle a été conseillère juridique au cabinet du Premier ministre entre 2010 et 2012.',
  'Barreau de Bruxelles, 1998',
  array['FR', 'NL', 'EN'],
  true,
  2
),
(
  'b0000003-1111-4111-8111-000000000003',
  'a0000003-1111-4111-8111-000000000003',
  'jean-marc-petit',
  'Jean-Marc Petit',
  'Associé fondateur',
  array['Tax', 'Fiscalité internationale', 'Prix de transfert'],
  'jm.petit@maison-alderic.be',
  '+32 2 234 56 03',
  'Jean-Marc Petit pilote la pratique fiscale du cabinet. Il accompagne des groupes multinationaux et family offices sur la structuration de leurs opérations transfrontalières, les prix de transfert et la mise en conformité avec les nouveaux standards OCDE (BEPS, Pilier 2). Ancien collaborateur de PwC Tax Consultants, il a co-écrit plusieurs ouvrages de référence sur la fiscalité belgo-luxembourgeoise.',
  'Barreau de Bruxelles, 2001',
  array['FR', 'NL', 'EN'],
  true,
  3
),
(
  'b0000004-1111-4111-8111-000000000004',
  'a0000004-1111-4111-8111-000000000004',
  'anais-lambert',
  'Anaïs Lambert',
  'Associée',
  array['Restructuring', 'Insolvabilité', 'Corporate'],
  'a.lambert@maison-alderic.be',
  '+32 2 234 56 04',
  'Anaïs Lambert dirige la pratique Restructurations et Insolvabilité. Elle intervient sur les procédures de réorganisation judiciaire, les insolvabilités transfrontalières et les opérations de distressed M&A. Elle est mandataire de justice agréée près les tribunaux de l''entreprise francophones de Bruxelles et a co-fondé en 2020 le Cercle belge du droit de la restructuration.',
  'Barreau de Bruxelles, 2007',
  array['FR', 'NL', 'EN'],
  true,
  4
),
(
  'b0000005-1111-4111-8111-000000000005',
  'a0000005-1111-4111-8111-000000000005',
  'marc-dewinter',
  'Marc Dewinter',
  'Counsel',
  array['M&A', 'Joint Ventures', 'Corporate Governance'],
  'm.dewinter@maison-alderic.be',
  '+32 2 234 56 05',
  'Marc Dewinter accompagne les clients du cabinet sur les opérations de croissance externe et les joint-ventures industrielles. Il a piloté plusieurs acquisitions structurantes pour des groupes belges côtés (Euronext Bruxelles) entre 2018 et 2024.',
  'Barreau de Bruxelles, 2009',
  array['FR', 'NL', 'EN'],
  false,
  5
),
(
  'b0000006-1111-4111-8111-000000000006',
  'a0000006-1111-4111-8111-000000000006',
  'lea-brouwers',
  'Léa Brouwers',
  'Senior Associate',
  array['Private Equity', 'Fund Formation', 'M&A'],
  'l.brouwers@maison-alderic.be',
  '+32 2 234 56 06',
  'Léa Brouwers conseille les fonds de Private Equity actifs en Belgique et au Luxembourg sur leurs investissements et leurs structurations. Elle est l''auteure de plusieurs publications sur les continuation funds et les opérations secondaires.',
  'Barreau de Bruxelles, 2013',
  array['FR', 'NL', 'EN'],
  false,
  6
),
(
  'b0000007-1111-4111-8111-000000000007',
  'a0000007-1111-4111-8111-000000000007',
  'olivier-maertens',
  'Olivier Maertens',
  'Senior Associate',
  array['Litigation', 'White-Collar Crime', 'Compliance'],
  'o.maertens@maison-alderic.be',
  '+32 2 234 56 07',
  'Olivier Maertens intervient sur les contentieux commerciaux complexes et les enquêtes internes en matière de compliance et de droit pénal des affaires. Il a participé à plusieurs procédures CEPANI majeures depuis 2020.',
  'Barreau de Bruxelles, 2014',
  array['FR', 'NL', 'EN'],
  false,
  7
),
(
  'b0000008-1111-4111-8111-000000000008',
  'a0000008-1111-4111-8111-000000000008',
  'camilla-janssens',
  'Camille Janssens',
  'Senior Associate',
  array['Tax', 'TVA', 'Litiges fiscaux'],
  'c.janssens@maison-alderic.be',
  '+32 2 234 56 08',
  'Camille Janssens accompagne les clients du cabinet sur la fiscalité directe et indirecte, ainsi que sur les contentieux fiscaux devant les juridictions belges et la CJUE. Elle est diplômée du Master en droit fiscal de la KU Leuven.',
  'Barreau de Bruxelles, 2015',
  array['FR', 'NL', 'EN'],
  false,
  8
);

-- ----------------------------------------------------------------------------
-- Update profiles (le trigger handle_new_user a créé les profiles avec
-- les valeurs minimales — on ajoute company/phone si pas déjà fait)
-- ----------------------------------------------------------------------------
update public.profiles set role = 'avocat'
  where id in (
    'a0000001-1111-4111-8111-000000000001',
    'a0000002-1111-4111-8111-000000000002',
    'a0000003-1111-4111-8111-000000000003',
    'a0000004-1111-4111-8111-000000000004',
    'a0000005-1111-4111-8111-000000000005',
    'a0000006-1111-4111-8111-000000000006',
    'a0000007-1111-4111-8111-000000000007',
    'a0000008-1111-4111-8111-000000000008'
  );
