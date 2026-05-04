-- ============================================================================
-- 13 — SEED : DOSSIERS + tables liées (timeline, documents, messages, RDV, factures)
-- ============================================================================
-- 13 dossiers répartis sur 5 clients fictifs.
-- ============================================================================

-- ============================================================================
-- DOSSIERS
-- ============================================================================
insert into public.dossiers (
  id, reference, title, description, status, type, client_id,
  budget_estimated, budget_consumed, opened_at, closed_at
) values
-- ─── Client 1 : Élise Vandenbroucke (TechScale BV) — 3 dossiers actifs ────
(
  'e0000001-5555-4555-8555-000000000001',
  'MA-2026-0001',
  'Tour de table Série C — TechScale BV',
  'Conseil sur le tour de table Série C de 75M€. Coordination des term sheets, restructuration cap table, négociation pacte d''actionnaires et mise en place ESOP étendu post-closing.',
  'active', 'PE',
  'c0000001-2222-4222-8222-000000000001',
  180000.00, 124500.00,
  '2026-01-08 09:00:00+01', null
),
(
  'e0000002-5555-4555-8555-000000000002',
  'MA-2026-0002',
  'Refonte ESOP post-Série C',
  'Élargissement de l''ESOP de 8% à 12% post-Series C. Nouvelle vesting schedule, intégration des employés clés et structuration fiscale Belgique/France/Pays-Bas.',
  'active', 'Corporate',
  'c0000001-2222-4222-8222-000000000001',
  35000.00, 18200.00,
  '2026-03-20 09:00:00+01', null
),
(
  'e0000003-5555-4555-8555-000000000003',
  'MA-2026-0003',
  'Ouverture filiale française — TechScale France SAS',
  'Constitution d''une filiale en France pour accompagner l''expansion commerciale. Statuts, gouvernance, contrat de prestation intra-groupe et structuration TVA.',
  'active', 'Corporate',
  'c0000001-2222-4222-8222-000000000001',
  22000.00, 8400.00,
  '2026-04-15 09:00:00+02', null
),

-- ─── Client 2 : Pierre Vandenberghe (BIH) — 5 dossiers ─────────────────────
(
  'f0000001-5555-4555-8555-000000000004',
  'MA-2025-0042',
  'Acquisition TechCo France',
  'Acquisition de 100% de TechCo France (240M€). Négociation SPA, due diligence, financement mezzanine et closing en 4 mois.',
  'won', 'M&A',
  'c0000002-2222-4222-8222-000000000002',
  850000.00, 832000.00,
  '2025-04-10 09:00:00+02', '2025-09-30 18:00:00+02'
),
(
  'f0000002-5555-4555-8555-000000000005',
  'MA-2026-0004',
  'Suivi post-closing TechCo — litige earn-out',
  'Gestion du suivi post-closing de l''acquisition TechCo France. Désaccord en cours sur le calcul du second tranche d''earn-out (12M€). Procédure d''expertise contractuelle initiée.',
  'active', 'Litigation',
  'c0000002-2222-4222-8222-000000000002',
  120000.00, 47500.00,
  '2026-02-01 09:00:00+01', null
),
(
  'f0000003-5555-4555-8555-000000000006',
  'MA-2026-0005',
  'Audit fiscal Pilier 2 — groupe BIH',
  'Mise en conformité du groupe avec les règles GloBE Pilier 2. Cartographie juridictionnelle, calcul TIE par juridiction, configuration des outputs GloBE et préparation première GIR.',
  'active', 'Tax',
  'c0000002-2222-4222-8222-000000000002',
  95000.00, 62000.00,
  '2026-01-22 09:00:00+01', null
),
(
  'f0000004-5555-4555-8555-000000000007',
  'MA-2026-0006',
  'Joint-venture industrielle Asie',
  'Mise en place d''une JV 60/40 avec un partenaire japonais pour la pénétration du marché asiatique. Structuration corporate, accords IP, coordination réglementaire JFTC et FCCA.',
  'active', 'M&A',
  'c0000002-2222-4222-8222-000000000002',
  280000.00, 145000.00,
  '2026-03-05 09:00:00+01', null
),
(
  'f0000005-5555-4555-8555-000000000008',
  'MA-2025-0028',
  'Litige distributeur exclusif Italie',
  'Contentieux commercial avec un ancien distributeur italien suite à la rupture des relations contractuelles. Procédure menée devant le tribunal de Bruxelles avec sentence favorable obtenue en 2025.',
  'won', 'Litigation',
  'c0000002-2222-4222-8222-000000000002',
  140000.00, 138500.00,
  '2024-11-12 09:00:00+01', '2025-10-08 17:00:00+02'
),

-- ─── Client 3 : Christine de Hennin (Family Office) — 2 dossiers ───────────
(
  'c0000001-5555-4555-8555-000000000009',
  'MA-2026-0007',
  'Restructuration patrimoniale — transmission Gen 3',
  'Préparation de la transmission patrimoniale à la troisième génération de la famille. Pacte familial, structuration STAK néerlandaise, optimisation fiscale belgo-luxembourgeoise.',
  'active', 'Corporate',
  'c0000003-2222-4222-8222-000000000003',
  220000.00, 78000.00,
  '2026-02-14 09:00:00+01', null
),
(
  'c0000002-5555-4555-8555-000000000010',
  'MA-2026-0008',
  'Cession participation IndustrieCo (Phase 2)',
  'Continuation de la cession initiée en 2024 — cession des 12% résiduels conservés à titre transitoire. Négociation conditions, accord de gouvernance final.',
  'active', 'M&A',
  'c0000003-2222-4222-8222-000000000003',
  85000.00, 32000.00,
  '2026-04-02 09:00:00+02', null
),

-- ─── Client 4 : Thomas Mertens (Entrepreneur) — 1 dossier ─────────────────
(
  'd0000001-5555-4555-8555-000000000011',
  'MA-2026-0009',
  'Structuration véhicule d''investissement Mertens Capital',
  'Création de Mertens Capital — véhicule d''investissement personnel. Structure SCSp luxembourgeoise, accord avec management, premier closing prévu Q3 2026.',
  'active', 'PE',
  'c0000004-2222-4222-8222-000000000004',
  45000.00, 11500.00,
  '2026-04-22 09:00:00+02', null
),

-- ─── Client 5 : Caroline Dubois (Distribution Group SA) — 4 dossiers ──────
(
  'b0000001-5555-4555-8555-000000000012',
  'MA-2024-0015',
  'Procédure de réorganisation judiciaire',
  'PRJ par accord collectif devant le tribunal de l''entreprise francophone de Bruxelles. Plan homologué à 87% des votes en faveur. Sortie de procédure réussie en 2024.',
  'won', 'Restructuring',
  'c0000005-2222-4222-8222-000000000005',
  320000.00, 318000.00,
  '2024-03-15 09:00:00+01', '2024-12-20 18:00:00+01'
),
(
  'b0000002-5555-4555-8555-000000000013',
  'MA-2025-0019',
  'Suivi post-PRJ — relations créanciers principaux',
  'Accompagnement post-homologation : exécution du plan, gestion des créanciers récalcitrants, ajustements opérationnels.',
  'archived', 'Restructuring',
  'c0000005-2222-4222-8222-000000000005',
  85000.00, 84500.00,
  '2025-01-08 09:00:00+01', '2025-11-30 18:00:00+01'
),
(
  'b0000003-5555-4555-8555-000000000014',
  'MA-2026-0010',
  'Acquisition Concurrent SA',
  'Acquisition stratégique d''un concurrent belge en redressement. Structure carve-out, négociation avec curateurs, financement à mettre en place.',
  'active', 'M&A',
  'c0000005-2222-4222-8222-000000000005',
  340000.00, 142000.00,
  '2026-02-26 09:00:00+01', null
);

-- ============================================================================
-- DOSSIER_AVOCATS — affectations
-- ============================================================================
insert into public.dossier_avocats (dossier_id, avocat_id, role) values
-- TechScale Series C
('e0000001-5555-4555-8555-000000000001', 'b0000005-1111-4111-8111-000000000005', 'lead'),
('e0000001-5555-4555-8555-000000000001', 'b0000006-1111-4111-8111-000000000006', 'support'),
-- ESOP refonte
('e0000002-5555-4555-8555-000000000002', 'b0000006-1111-4111-8111-000000000006', 'lead'),
('e0000002-5555-4555-8555-000000000002', 'b0000005-1111-4111-8111-000000000005', 'support'),
-- Filiale France
('e0000003-5555-4555-8555-000000000003', 'b0000005-1111-4111-8111-000000000005', 'lead'),
-- BIH × TechCo (closed)
('f0000001-5555-4555-8555-000000000004', 'b0000001-1111-4111-8111-000000000001', 'lead'),
('f0000001-5555-4555-8555-000000000004', 'b0000005-1111-4111-8111-000000000005', 'support'),
('f0000001-5555-4555-8555-000000000004', 'b0000006-1111-4111-8111-000000000006', 'support'),
-- Earn-out litige
('f0000002-5555-4555-8555-000000000005', 'b0000007-1111-4111-8111-000000000007', 'lead'),
('f0000002-5555-4555-8555-000000000005', 'b0000001-1111-4111-8111-000000000001', 'support'),
-- Pilier 2
('f0000003-5555-4555-8555-000000000006', 'b0000003-1111-4111-8111-000000000003', 'lead'),
('f0000003-5555-4555-8555-000000000006', 'b0000008-1111-4111-8111-000000000008', 'support'),
-- JV Asie
('f0000004-5555-4555-8555-000000000007', 'b0000001-1111-4111-8111-000000000001', 'lead'),
('f0000004-5555-4555-8555-000000000007', 'b0000005-1111-4111-8111-000000000005', 'support'),
-- Litige distributeur (closed)
('f0000005-5555-4555-8555-000000000008', 'b0000002-1111-4111-8111-000000000002', 'lead'),
('f0000005-5555-4555-8555-000000000008', 'b0000007-1111-4111-8111-000000000007', 'support'),
-- Restructuration patrimoniale
('c0000001-5555-4555-8555-000000000009', 'b0000003-1111-4111-8111-000000000003', 'lead'),
('c0000001-5555-4555-8555-000000000009', 'b0000001-1111-4111-8111-000000000001', 'support'),
-- Cession IndustrieCo
('c0000002-5555-4555-8555-000000000010', 'b0000001-1111-4111-8111-000000000001', 'lead'),
-- Mertens Capital onboarding
('d0000001-5555-4555-8555-000000000011', 'b0000006-1111-4111-8111-000000000006', 'lead'),
-- DG PRJ (closed)
('b0000001-5555-4555-8555-000000000012', 'b0000004-1111-4111-8111-000000000004', 'lead'),
('b0000001-5555-4555-8555-000000000012', 'b0000007-1111-4111-8111-000000000007', 'support'),
-- DG suivi PRJ (archived)
('b0000002-5555-4555-8555-000000000013', 'b0000004-1111-4111-8111-000000000004', 'lead'),
-- DG acquisition concurrent
('b0000003-5555-4555-8555-000000000014', 'b0000001-1111-4111-8111-000000000001', 'lead'),
('b0000003-5555-4555-8555-000000000014', 'b0000004-1111-4111-8111-000000000004', 'support');

-- ============================================================================
-- DOSSIER_TIMELINE — étapes des dossiers actifs
-- ============================================================================
insert into public.dossier_timeline (dossier_id, title, description, status, due_date, completed_at, created_by, display_order) values
-- TechScale Series C
('e0000001-5555-4555-8555-000000000001', 'Term sheet finalisé', 'Term sheet négocié avec lead investor — closing target Q2 2026.', 'completed', null, '2026-01-22 17:00:00+01', 'b0000005-1111-4111-8111-000000000005', 1),
('e0000001-5555-4555-8555-000000000001', 'Due diligence vendor', 'VDD legal+financial+tax livrée à l''ensemble des investisseurs.', 'completed', null, '2026-02-15 18:00:00+01', 'b0000005-1111-4111-8111-000000000005', 2),
('e0000001-5555-4555-8555-000000000001', 'Négociation SPA + SHA', 'Drafts en cours — points sensibles : drag-along, ROFR, board seats.', 'in_progress', '2026-05-15 18:00:00+02', null, 'b0000005-1111-4111-8111-000000000005', 3),
('e0000001-5555-4555-8555-000000000001', 'Signing & closing', 'Signing prévu fin mai, closing après conditions suspensives (regulatory + ESOP rollover).', 'pending', '2026-06-30 18:00:00+02', null, 'b0000005-1111-4111-8111-000000000005', 4),
-- ESOP refonte
('e0000002-5555-4555-8555-000000000002', 'Mapping bénéficiaires', 'Liste des employés éligibles validée avec le CEO et le RH.', 'completed', null, '2026-04-02 17:00:00+02', 'b0000006-1111-4111-8111-000000000006', 1),
('e0000002-5555-4555-8555-000000000002', 'Documentation ESOP rédigée', 'Plan rules, grant letters, vesting schedule.', 'in_progress', '2026-05-20 18:00:00+02', null, 'b0000006-1111-4111-8111-000000000006', 2),
-- Filiale France
('e0000003-5555-4555-8555-000000000003', 'Choix structure SAS vs SARL', 'SAS recommandée pour flexibilité gouvernance.', 'completed', null, '2026-04-25 17:00:00+02', 'b0000005-1111-4111-8111-000000000005', 1),
('e0000003-5555-4555-8555-000000000003', 'Constitution + immatriculation', 'Statuts en cours de finalisation, dépôt RCS Paris prévu mi-mai.', 'in_progress', '2026-05-22 18:00:00+02', null, 'b0000005-1111-4111-8111-000000000005', 2),
-- BIH earn-out
('f0000002-5555-4555-8555-000000000005', 'Notification désaccord earn-out', 'Notification formelle du désaccord à TechCo France et au seller.', 'completed', null, '2026-02-12 17:00:00+01', 'b0000007-1111-4111-8111-000000000007', 1),
('f0000002-5555-4555-8555-000000000005', 'Désignation expert indépendant', 'Expert désigné par accord (Mazars). Mission cadrée.', 'completed', null, '2026-03-08 18:00:00+01', 'b0000007-1111-4111-8111-000000000007', 2),
('f0000002-5555-4555-8555-000000000005', 'Soumissions des parties à l''expert', 'Mémoires soumis. Expert en analyse contradictoire.', 'in_progress', '2026-05-30 18:00:00+02', null, 'b0000007-1111-4111-8111-000000000007', 3),
('f0000002-5555-4555-8555-000000000005', 'Sentence experte attendue', null, 'pending', '2026-07-15 18:00:00+02', null, 'b0000007-1111-4111-8111-000000000007', 4),
-- Pilier 2
('f0000003-5555-4555-8555-000000000006', 'Cartographie juridictionnelle', '14 juridictions en périmètre. 3 juridictions à risque TIE < 15%.', 'completed', null, '2026-02-28 18:00:00+01', 'b0000003-1111-4111-8111-000000000003', 1),
('f0000003-5555-4555-8555-000000000006', 'Configuration ERP outputs GloBE', 'Travail en cours avec l''équipe finance groupe.', 'in_progress', '2026-06-10 18:00:00+02', null, 'b0000003-1111-4111-8111-000000000003', 2),
('f0000003-5555-4555-8555-000000000006', 'Première GIR à déposer', 'Deadline réglementaire 30 juin 2026.', 'pending', '2026-06-30 23:59:59+02', null, 'b0000003-1111-4111-8111-000000000003', 3),
-- JV Asie
('f0000004-5555-4555-8555-000000000007', 'Letter of Intent signée', 'LOI non-binding signée avec partenaire japonais.', 'completed', null, '2026-03-12 18:00:00+01', 'b0000001-1111-4111-8111-000000000001', 1),
('f0000004-5555-4555-8555-000000000007', 'Structure JV finalisée', 'KK japonaise, NV belge, holding luxembourgeoise.', 'in_progress', '2026-05-25 18:00:00+02', null, 'b0000001-1111-4111-8111-000000000001', 2),
-- Restructuration patrimoniale
('c0000001-5555-4555-8555-000000000009', 'Audit patrimonial complet', 'Cartographie active/passive de la famille. Identification des actifs critiques.', 'completed', null, '2026-03-20 18:00:00+01', 'b0000003-1111-4111-8111-000000000003', 1),
('c0000001-5555-4555-8555-000000000009', 'Pacte familial — premier draft', 'Pacte de gouvernance et droits de préemption.', 'in_progress', '2026-05-30 18:00:00+02', null, 'b0000003-1111-4111-8111-000000000003', 2),
-- Mertens Capital onboarding
('d0000001-5555-4555-8555-000000000011', 'Onboarding kick-off meeting', 'Réunion de cadrage tenue. Objectifs et calendrier validés.', 'completed', null, '2026-04-25 17:00:00+02', 'b0000006-1111-4111-8111-000000000006', 1),
('d0000001-5555-4555-8555-000000000011', 'Choix juridiction véhicule', 'Luxembourg (SCSp) recommandé.', 'completed', null, '2026-04-29 17:00:00+02', 'b0000006-1111-4111-8111-000000000006', 2),
('d0000001-5555-4555-8555-000000000011', 'Documentation constitutive', 'LPA, side letters template, mémorandum d''information.', 'in_progress', '2026-06-15 18:00:00+02', null, 'b0000006-1111-4111-8111-000000000006', 3),
-- DG acquisition concurrent
('b0000003-5555-4555-8555-000000000014', 'Premier contact curateurs', 'Lettre d''intention déposée auprès des curateurs.', 'completed', null, '2026-03-08 18:00:00+01', 'b0000001-1111-4111-8111-000000000001', 1),
('b0000003-5555-4555-8555-000000000014', 'Due diligence carve-out', 'DD légale + financière en cours sur le périmètre cible.', 'in_progress', '2026-05-30 18:00:00+02', null, 'b0000001-1111-4111-8111-000000000001', 2);

-- ============================================================================
-- DOCUMENTS (placeholders — file_path prêt à recevoir un upload réel)
-- ============================================================================
insert into public.documents (
  dossier_id, name, description, file_path, file_size, mime_type,
  category, is_signed, signed_at, uploaded_by, visible_to_client
) values
-- TechScale Series C
('e0000001-5555-4555-8555-000000000001', 'Mandat — Tour Série C.pdf', 'Mandat signé par Élise Vandenbroucke', 'e0000001-5555-4555-8555-000000000001/mandat-series-c.pdf', 245760, 'application/pdf', 'mandat', true, '2026-01-09 14:30:00+01', 'a0000005-1111-4111-8111-000000000005', true),
('e0000001-5555-4555-8555-000000000001', 'Term Sheet final.pdf', 'Term sheet finalisé avec lead investor', 'e0000001-5555-4555-8555-000000000001/term-sheet-final.pdf', 412300, 'application/pdf', 'contract', true, '2026-01-22 16:00:00+01', 'a0000005-1111-4111-8111-000000000005', true),
('e0000001-5555-4555-8555-000000000001', 'VDD Legal Pack v3.pdf', 'Vendor Due Diligence légale finale', 'e0000001-5555-4555-8555-000000000001/vdd-legal-v3.pdf', 8921000, 'application/pdf', 'other', false, null, 'a0000005-1111-4111-8111-000000000005', true),
('e0000001-5555-4555-8555-000000000001', 'SPA — draft 4.docx', 'Draft 4 du Share Purchase Agreement', 'e0000001-5555-4555-8555-000000000001/spa-draft-4.docx', 156000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'contract', false, null, 'a0000005-1111-4111-8111-000000000005', true),
('e0000001-5555-4555-8555-000000000001', 'Memo — Drag-along issues.docx', 'Note interne — point de tension avec lead', 'e0000001-5555-4555-8555-000000000001/memo-drag-along.docx', 89000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'other', false, null, 'a0000005-1111-4111-8111-000000000005', false),
-- ESOP
('e0000002-5555-4555-8555-000000000002', 'ESOP Plan Rules — draft 2.pdf', 'Règlement du nouveau plan ESOP', 'e0000002-5555-4555-8555-000000000002/esop-plan-rules.pdf', 187000, 'application/pdf', 'contract', false, null, 'a0000006-1111-4111-8111-000000000006', true),
('e0000002-5555-4555-8555-000000000002', 'Liste bénéficiaires éligibles.xlsx', null, 'e0000002-5555-4555-8555-000000000002/liste-beneficiaires.xlsx', 45000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'other', false, null, 'a0000006-1111-4111-8111-000000000006', true),
-- Filiale France
('e0000003-5555-4555-8555-000000000003', 'Statuts SAS TechScale France — projet.pdf', null, 'e0000003-5555-4555-8555-000000000003/statuts-sas-projet.pdf', 234000, 'application/pdf', 'contract', false, null, 'a0000005-1111-4111-8111-000000000005', true),
-- BIH × TechCo (closed)
('f0000001-5555-4555-8555-000000000004', 'SPA TechCo France — version signée.pdf', 'SPA exécuté le 15/09/2025', 'f0000001-5555-4555-8555-000000000004/spa-techco-signe.pdf', 1240000, 'application/pdf', 'contract', true, '2025-09-15 14:00:00+02', 'a0000001-1111-4111-8111-000000000001', true),
('f0000001-5555-4555-8555-000000000004', 'Mandat originel.pdf', null, 'f0000001-5555-4555-8555-000000000004/mandat-bih-techco.pdf', 198000, 'application/pdf', 'mandat', true, '2025-04-12 10:00:00+02', 'a0000001-1111-4111-8111-000000000001', true),
('f0000001-5555-4555-8555-000000000004', 'Closing Memorandum.pdf', null, 'f0000001-5555-4555-8555-000000000004/closing-memo.pdf', 543000, 'application/pdf', 'correspondence', false, null, 'a0000001-1111-4111-8111-000000000001', true),
-- Earn-out
('f0000002-5555-4555-8555-000000000005', 'Notification désaccord earn-out.pdf', 'Notification formelle datée du 12/02/2026', 'f0000002-5555-4555-8555-000000000005/notification-desaccord.pdf', 165000, 'application/pdf', 'correspondence', true, '2026-02-12 11:00:00+01', 'a0000007-1111-4111-8111-000000000007', true),
('f0000002-5555-4555-8555-000000000005', 'Mémoire client à expert.pdf', 'Soumission de notre client à l''expert', 'f0000002-5555-4555-8555-000000000005/memoire-bih.pdf', 678000, 'application/pdf', 'pleading', false, null, 'a0000007-1111-4111-8111-000000000007', true),
-- Pilier 2
('f0000003-5555-4555-8555-000000000006', 'Cartographie juridictionnelle GloBE.xlsx', null, 'f0000003-5555-4555-8555-000000000006/carto-globe.xlsx', 245000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'other', false, null, 'a0000003-1111-4111-8111-000000000003', true),
('f0000003-5555-4555-8555-000000000006', 'Memo Pilier 2 — implications BIH.pdf', null, 'f0000003-5555-4555-8555-000000000006/memo-pilier2.pdf', 412000, 'application/pdf', 'other', false, null, 'a0000003-1111-4111-8111-000000000003', true),
-- JV Asie
('f0000004-5555-4555-8555-000000000007', 'LOI non-binding partenaire JP.pdf', null, 'f0000004-5555-4555-8555-000000000007/loi-partenaire-jp.pdf', 287000, 'application/pdf', 'contract', true, '2026-03-12 16:00:00+01', 'a0000001-1111-4111-8111-000000000001', true),
-- Restructuration patrimoniale
('c0000001-5555-4555-8555-000000000009', 'Audit patrimonial famille de Hennin.pdf', null, 'c0000001-5555-4555-8555-000000000009/audit-patrimonial.pdf', 1820000, 'application/pdf', 'other', false, null, 'a0000003-1111-4111-8111-000000000003', true),
('c0000001-5555-4555-8555-000000000009', 'Pacte familial — draft 1.docx', null, 'c0000001-5555-4555-8555-000000000009/pacte-familial-d1.docx', 145000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'contract', false, null, 'a0000003-1111-4111-8111-000000000003', true),
-- Mertens Capital
('d0000001-5555-4555-8555-000000000011', 'Mémorandum Mertens Capital.pdf', null, 'd0000001-5555-4555-8555-000000000011/memorandum.pdf', 678000, 'application/pdf', 'other', false, null, 'a0000006-1111-4111-8111-000000000006', true),
('d0000001-5555-4555-8555-000000000011', 'LPA template SCSp.pdf', null, 'd0000001-5555-4555-8555-000000000011/lpa-template.pdf', 945000, 'application/pdf', 'contract', false, null, 'a0000006-1111-4111-8111-000000000006', true),
-- DG acquisition concurrent
('b0000003-5555-4555-8555-000000000014', 'Lettre d''intention curateurs.pdf', null, 'b0000003-5555-4555-8555-000000000014/loi-curateurs.pdf', 198000, 'application/pdf', 'correspondence', true, '2026-03-08 14:00:00+01', 'a0000001-1111-4111-8111-000000000001', true),
('b0000003-5555-4555-8555-000000000014', 'Rapport DD légale — interim.pdf', null, 'b0000003-5555-4555-8555-000000000014/dd-legale-interim.pdf', 1320000, 'application/pdf', 'other', false, null, 'a0000001-1111-4111-8111-000000000001', false);

-- ============================================================================
-- MESSAGES — threads par dossier (clients ↔ avocats)
-- ============================================================================
insert into public.messages (dossier_id, sender_id, sender_type, content, read_at, created_at) values
-- Thread TechScale Series C (entre Élise et Marc D)
('e0000001-5555-4555-8555-000000000001', 'a0000001-1111-4111-8111-000000000001'::uuid, 'avocat',
 'Bonjour Élise, le term sheet final est dans la data room. Pouvez-vous valider la formulation de la clause drag-along avant que je l''envoie au lead ?',
 '2026-01-21 14:30:00+01', '2026-01-21 11:15:00+01'),
('e0000001-5555-4555-8555-000000000001', 'c0000001-2222-4222-8222-000000000001', 'client',
 'Bonjour Aldéric, validé. Une question : est-ce que la clause de leaver good/bad qu''on a négociée s''applique aussi aux founders ou uniquement aux nouveaux entrants ESOP ?',
 '2026-01-21 16:00:00+01', '2026-01-21 15:45:00+01'),
('e0000001-5555-4555-8555-000000000001', 'a0000005-1111-4111-8111-000000000005', 'avocat',
 'Très bonne question — actuellement seulement les nouveaux entrants. On peut étendre aux founders mais ça va déclencher une renégociation côté lead. Je vous recommande de NE PAS étendre — les founders sont protégés autrement.',
 '2026-01-22 09:30:00+01', '2026-01-22 08:50:00+01'),
('e0000001-5555-4555-8555-000000000001', 'c0000001-2222-4222-8222-000000000001', 'client',
 'OK je vous fais confiance. On reste sur le périmètre actuel.',
 '2026-01-22 10:15:00+01', '2026-01-22 10:10:00+01'),
('e0000001-5555-4555-8555-000000000001', 'a0000005-1111-4111-8111-000000000005', 'avocat',
 'Term sheet finalisé et signé hier soir. Prochaines étapes : VDD livraison avant 15/02, puis SPA/SHA drafts d''ici fin février. Je vous tiens informée.',
 '2026-01-23 09:00:00+01', '2026-01-23 08:30:00+01'),
-- ESOP
('e0000002-5555-4555-8555-000000000002', 'a0000006-1111-4111-8111-000000000006', 'avocat',
 'Élise, j''ai finalisé la liste des bénéficiaires ESOP avec le RH. Pouvez-vous valider ?',
 '2026-04-02 17:30:00+02', '2026-04-02 16:00:00+02'),
('e0000002-5555-4555-8555-000000000002', 'c0000001-2222-4222-8222-000000000001', 'client',
 'Validé. Dernière question : le vesting de 4 ans avec cliff 1 an reste OK pour les nouveaux entrants ?',
 '2026-04-03 09:30:00+02', '2026-04-03 09:15:00+02'),
('e0000002-5555-4555-8555-000000000002', 'a0000006-1111-4111-8111-000000000006', 'avocat',
 'Oui parfait. Standard de marché. Je rédige les grant letters cette semaine.',
 null, '2026-04-03 11:00:00+02'),

-- Thread BIH Pilier 2 (Pierre × Jean-Marc)
('f0000003-5555-4555-8555-000000000006', 'a0000003-1111-4111-8111-000000000003', 'avocat',
 'Pierre, la cartographie juridictionnelle est terminée. 3 juridictions ressortent à risque : Hong Kong, Irlande, Hongrie. Je préfère qu''on en parle de vive voix.',
 '2026-02-28 18:30:00+01', '2026-02-28 18:00:00+01'),
('f0000003-5555-4555-8555-000000000006', 'c0000002-2222-4222-8222-000000000002', 'client',
 'Compris. Disponible jeudi 14h, ça vous va ? Je préviens Sarah du contrôle de gestion.',
 '2026-03-01 09:00:00+01', '2026-03-01 08:45:00+01'),
('f0000003-5555-4555-8555-000000000006', 'a0000003-1111-4111-8111-000000000003', 'avocat',
 'Parfait, jeudi 14h calé. Je viendrai avec Camille (notre senior tax). Ordre du jour transmis hier soir.',
 '2026-03-01 11:00:00+01', '2026-03-01 10:30:00+01'),

-- Thread BIH earn-out (Pierre × Olivier)
('f0000002-5555-4555-8555-000000000005', 'a0000007-1111-4111-8111-000000000007', 'avocat',
 'Pierre, l''expert Mazars a confirmé sa désignation. Mission cadrée. On a 6 semaines pour soumettre nos mémoires.',
 '2026-03-08 19:00:00+01', '2026-03-08 18:30:00+01'),
('f0000002-5555-4555-8555-000000000005', 'c0000002-2222-4222-8222-000000000002', 'client',
 'Bien reçu. Vous voulez qu''on se voie pour cadrer la stratégie de mémoire ?',
 '2026-03-09 10:00:00+01', '2026-03-09 09:30:00+01'),
('f0000002-5555-4555-8555-000000000005', 'a0000007-1111-4111-8111-000000000007', 'avocat',
 'Oui — je propose mardi prochain 10h en visio. Je t''envoie un lien Teams.',
 null, '2026-03-09 14:00:00+01'),

-- Thread Hennin restructuration
('c0000001-5555-4555-8555-000000000009', 'a0000003-1111-4111-8111-000000000003', 'avocat',
 'Christine, l''audit patrimonial est terminé. Document dans la data room. Trois points méritent qu''on en parle : structuration STAK, traitement de la SCI familiale, optimisation luxembourgeoise.',
 '2026-03-21 09:00:00+01', '2026-03-20 18:00:00+01'),
('c0000001-5555-4555-8555-000000000009', 'c0000003-2222-4222-8222-000000000003', 'client',
 'Merci Jean-Marc. Les 4 cousins sont d''accord sur le principe d''une réunion famille fin avril. On reprogramme notre point ensemble pour préparer ?',
 '2026-03-22 10:30:00+01', '2026-03-22 09:45:00+01'),

-- Thread Mertens Capital onboarding (Thomas × Léa)
('d0000001-5555-4555-8555-000000000011', 'a0000006-1111-4111-8111-000000000006', 'avocat',
 'Bienvenue Thomas. Le mémorandum d''information est dans la data room. Premier closing target Q3 — calendrier confirmé.',
 '2026-04-25 18:00:00+02', '2026-04-25 17:30:00+02'),
('d0000001-5555-4555-8555-000000000011', 'c0000004-2222-4222-8222-000000000004', 'client',
 'Top, merci Léa. J''ai 2-3 questions sur le LPA template. On peut prévoir 30 min ce vendredi ?',
 null, '2026-04-26 11:00:00+02');

-- ============================================================================
-- APPOINTMENTS
-- ============================================================================
insert into public.appointments (
  dossier_id, client_id, avocat_id, title, description,
  starts_at, ends_at, location, status
) values
-- RDV upcoming Hennin (le brief mentionne RDV upcoming pour ce client)
(
  'c0000001-5555-4555-8555-000000000009',
  'c0000003-2222-4222-8222-000000000003',
  'b0000003-1111-4111-8111-000000000003',
  'Réunion famille — préparation pacte familial',
  'Préparation de la réunion famille du 28/04. Validation de la structure proposée et arbitrages sur les points sensibles (SCI, droits de vote double, rachat de parts).',
  '2026-05-09 10:00:00+02', '2026-05-09 12:00:00+02',
  'Bureau Bruxelles, salle Magritte',
  'confirmed'
),
-- RDV Pilier 2 (déjà passé)
(
  'f0000003-5555-4555-8555-000000000006',
  'c0000002-2222-4222-8222-000000000002',
  'b0000003-1111-4111-8111-000000000003',
  'Restitution cartographie GloBE',
  'Présentation des résultats de la cartographie juridictionnelle et discussion des 3 juridictions à risque.',
  '2026-03-04 14:00:00+01', '2026-03-04 16:00:00+01',
  'Bureau Bruxelles, salle Horta',
  'completed'
),
-- RDV TechScale upcoming
(
  'e0000001-5555-4555-8555-000000000001',
  'c0000001-2222-4222-8222-000000000001',
  'b0000005-1111-4111-8111-000000000005',
  'Pré-signing TechScale Series C',
  'Revue finale du SPA et SHA avant signing. Validation des derniers points avec le CEO.',
  '2026-05-25 09:30:00+02', '2026-05-25 12:00:00+02',
  'Visio Teams',
  'scheduled'
),
-- RDV Mertens onboarding suite
(
  'd0000001-5555-4555-8555-000000000011',
  'c0000004-2222-4222-8222-000000000004',
  'b0000006-1111-4111-8111-000000000006',
  'LPA review — Mertens Capital',
  'Revue des questions sur le LPA template avec Thomas.',
  '2026-05-08 11:00:00+02', '2026-05-08 11:45:00+02',
  'Visio Teams',
  'scheduled'
),
-- RDV BIH earn-out
(
  'f0000002-5555-4555-8555-000000000005',
  'c0000002-2222-4222-8222-000000000002',
  'b0000007-1111-4111-8111-000000000007',
  'Stratégie mémoire expert',
  'Cadrage de la stratégie pour le mémoire à soumettre à l''expert Mazars.',
  '2026-03-17 10:00:00+01', '2026-03-17 11:30:00+01',
  'Visio Teams',
  'completed'
);

-- ============================================================================
-- INVOICES + INVOICE_LINES
-- ============================================================================

-- Invoice 1 : BIH × TechCo final (paid)
insert into public.invoices (id, invoice_number, client_id, dossier_id, amount_ht, vat_amount, amount_ttc, status, issued_at, due_at, paid_at) values
('a0000001-6666-4666-8666-000000000001', 'F2025-0142', 'c0000002-2222-4222-8222-000000000002', 'f0000001-5555-4555-8555-000000000004', 320000.00, 67200.00, 387200.00, 'paid', '2025-10-05 09:00:00+02', '2025-11-04 23:59:59+01', '2025-10-28 14:30:00+01');
insert into public.invoice_lines (invoice_id, description, quantity, unit_price, total, display_order) values
('a0000001-6666-4666-8666-000000000001', 'Acquisition TechCo France — phase due diligence (avr-juin 2025)', 1, 95000, 95000, 1),
('a0000001-6666-4666-8666-000000000001', 'Acquisition TechCo France — négociation SPA (juil-août 2025)', 1, 145000, 145000, 2),
('a0000001-6666-4666-8666-000000000001', 'Acquisition TechCo France — closing & post-closing (sept 2025)', 1, 80000, 80000, 3);

-- Invoice 2 : BIH Pilier 2 (sent, OVERDUE — client 2 a 1 facture en retard d'après le brief)
insert into public.invoices (id, invoice_number, client_id, dossier_id, amount_ht, vat_amount, amount_ttc, status, issued_at, due_at, paid_at, reminder_level) values
('a0000002-6666-4666-8666-000000000002', 'F2026-0008', 'c0000002-2222-4222-8222-000000000002', 'f0000003-5555-4555-8555-000000000006', 38500.00, 8085.00, 46585.00, 'overdue', '2026-03-15 09:00:00+01', '2026-04-14 23:59:59+02', null, 1);
insert into public.invoice_lines (invoice_id, description, quantity, unit_price, total, display_order) values
('a0000002-6666-4666-8666-000000000002', 'Cartographie juridictionnelle GloBE — phase 1', 1, 22000, 22000, 1),
('a0000002-6666-4666-8666-000000000002', 'Memo Pilier 2 — implications BIH', 1, 12500, 12500, 2),
('a0000002-6666-4666-8666-000000000002', 'Frais et débours', 1, 4000, 4000, 3);

-- Invoice 3 : TechScale Series C — acompte (paid)
insert into public.invoices (id, invoice_number, client_id, dossier_id, amount_ht, vat_amount, amount_ttc, status, issued_at, due_at, paid_at) values
('a0000003-6666-4666-8666-000000000003', 'F2026-0003', 'c0000001-2222-4222-8222-000000000001', 'e0000001-5555-4555-8555-000000000001', 60000.00, 12600.00, 72600.00, 'paid', '2026-02-01 09:00:00+01', '2026-03-03 23:59:59+01', '2026-02-18 16:00:00+01');
insert into public.invoice_lines (invoice_id, description, quantity, unit_price, total, display_order) values
('a0000003-6666-4666-8666-000000000003', 'Acompte mandat Series C — phase 1', 1, 60000, 60000, 1);

-- Invoice 4 : TechScale Series C — phase 2 (sent)
insert into public.invoices (id, invoice_number, client_id, dossier_id, amount_ht, vat_amount, amount_ttc, status, issued_at, due_at) values
('a0000004-6666-4666-8666-000000000004', 'F2026-0014', 'c0000001-2222-4222-8222-000000000001', 'e0000001-5555-4555-8555-000000000001', 64500.00, 13545.00, 78045.00, 'sent', '2026-04-02 09:00:00+02', '2026-05-02 23:59:59+02');
insert into public.invoice_lines (invoice_id, description, quantity, unit_price, total, display_order) values
('a0000004-6666-4666-8666-000000000004', 'Series C — VDD coordination & term sheet', 1, 38000, 38000, 1),
('a0000004-6666-4666-8666-000000000004', 'Series C — drafts SPA/SHA (phase 2)', 1, 22000, 22000, 2),
('a0000004-6666-4666-8666-000000000004', 'Frais et débours', 1, 4500, 4500, 3);

-- Invoice 5 : Hennin restructuration (sent)
insert into public.invoices (id, invoice_number, client_id, dossier_id, amount_ht, vat_amount, amount_ttc, status, issued_at, due_at) values
('a0000005-6666-4666-8666-000000000005', 'F2026-0011', 'c0000003-2222-4222-8222-000000000003', 'c0000001-5555-4555-8555-000000000009', 42000.00, 8820.00, 50820.00, 'sent', '2026-03-25 09:00:00+01', '2026-04-24 23:59:59+02');
insert into public.invoice_lines (invoice_id, description, quantity, unit_price, total, display_order) values
('a0000005-6666-4666-8666-000000000005', 'Audit patrimonial complet — famille de Hennin', 1, 28000, 28000, 1),
('a0000005-6666-4666-8666-000000000005', 'Recherches Luxembourg — structuration STAK', 1, 14000, 14000, 2);

-- Invoice 6 : DG acquisition (draft)
insert into public.invoices (id, invoice_number, client_id, dossier_id, amount_ht, vat_amount, amount_ttc, status) values
('a0000006-6666-4666-8666-000000000006', 'F2026-DRAFT-019', 'c0000005-2222-4222-8222-000000000005', 'b0000003-5555-4555-8555-000000000014', 78000.00, 16380.00, 94380.00, 'draft');
insert into public.invoice_lines (invoice_id, description, quantity, unit_price, total, display_order) values
('a0000006-6666-4666-8666-000000000006', 'Acquisition Concurrent — phase initiale (LOI + DD)', 1, 78000, 78000, 1);

-- Invoice 7 : DG suivi PRJ (paid - archived dossier)
insert into public.invoices (id, invoice_number, client_id, dossier_id, amount_ht, vat_amount, amount_ttc, status, issued_at, due_at, paid_at) values
('a0000007-6666-4666-8666-000000000007', 'F2025-0089', 'c0000005-2222-4222-8222-000000000005', 'b0000002-5555-4555-8555-000000000013', 28500.00, 5985.00, 34485.00, 'paid', '2025-09-15 09:00:00+02', '2025-10-15 23:59:59+02', '2025-10-08 11:00:00+02');
insert into public.invoice_lines (invoice_id, description, quantity, unit_price, total, display_order) values
('a0000007-6666-4666-8666-000000000007', 'Suivi post-PRJ — accompagnement créanciers (juil-août 2025)', 1, 28500, 28500, 1);

-- Invoice 8 : Mertens onboarding (sent)
insert into public.invoices (id, invoice_number, client_id, dossier_id, amount_ht, vat_amount, amount_ttc, status, issued_at, due_at) values
('a0000008-6666-4666-8666-000000000008', 'F2026-0017', 'c0000004-2222-4222-8222-000000000004', 'd0000001-5555-4555-8555-000000000011', 9500.00, 1995.00, 11495.00, 'sent', '2026-04-30 09:00:00+02', '2026-05-30 23:59:59+02');
insert into public.invoice_lines (invoice_id, description, quantity, unit_price, total, display_order) values
('a0000008-6666-4666-8666-000000000008', 'Mandat onboarding + kick-off Mertens Capital', 1, 9500, 9500, 1);

-- ============================================================================
-- CLEANUP — drop helper function utilisée uniquement pour le seed
-- ============================================================================
drop function if exists private.seed_create_user(uuid, text, text, text, text, text, text);
