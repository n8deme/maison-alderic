import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

const DEMO_SLUG = "maison-alderic";

// UUIDs créés par les migrations seed — à ne jamais supprimer
const SEED_USER_IDS = [
  // 8 avocats
  "a0000001-1111-4111-8111-000000000001",
  "a0000002-1111-4111-8111-000000000002",
  "a0000003-1111-4111-8111-000000000003",
  "a0000004-1111-4111-8111-000000000004",
  "a0000005-1111-4111-8111-000000000005",
  "a0000006-1111-4111-8111-000000000006",
  "a0000007-1111-4111-8111-000000000007",
  "a0000008-1111-4111-8111-000000000008",
  // 5 clients fictifs
  "c0000001-2222-4222-8222-000000000001",
  "c0000002-2222-4222-8222-000000000002",
  "c0000003-2222-4222-8222-000000000003",
  "c0000004-2222-4222-8222-000000000004",
  "c0000005-2222-4222-8222-000000000005",
];

const SEED_AVOCAT_USER_IDS = SEED_USER_IDS.slice(0, 8);

/** Dossiers seed (non purgés par ce cron) — refs alignées migration 13_seed_portail */
const DEMO_DOSSIERS = {
  techscale:  "e0000001-5555-4555-8555-000000000001",
  techco:     "f0000001-5555-4555-8555-000000000004",
  earnout:    "f0000002-5555-4555-8555-000000000005",
  concurrent: "b0000003-5555-4555-8555-000000000014",
  mertens:    "d0000001-5555-4555-8555-000000000011",
} as const;

const DEMO_INVOICES = {
  f2025_0142: "a0000001-6666-4666-8666-000000000001",
  f2026_0008: "a0000002-6666-4666-8666-000000000002",
  f2026_0003: "a0000003-6666-4666-8666-000000000003",
  f2026_0014: "a0000004-6666-4666-8666-000000000004",
  f2026_0017: "a0000008-6666-4666-8666-000000000008",
} as const;

type DemoAuditSeedSpec = {
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, string>;
};

/** 28 entrées variées — actions = logAuditEvent uniquement ; resource_id null si purge possible */
const DEMO_AUDIT_SEED_SPECS: DemoAuditSeedSpec[] = [
  { action: "dossier_created", resource_type: "dossier", resource_id: DEMO_DOSSIERS.techscale, metadata: { label: "Ouverture mandat Series C", ref: "MA-2026-0001" } },
  { action: "dossier_updated", resource_type: "dossier", resource_id: DEMO_DOSSIERS.techco, metadata: { label: "Statut closing mis à jour", ref: "MA-2025-0042" } },
  { action: "invoice_created", resource_type: "invoice", resource_id: DEMO_INVOICES.f2025_0142, metadata: { label: "Facture finale acquisition", ref: "F2025-0142" } },
  { action: "dossier_updated", resource_type: "dossier", resource_id: DEMO_DOSSIERS.earnout, metadata: { label: "Point expert earn-out", ref: "MA-2026-0004" } },
  { action: "note_created", resource_type: "note", resource_id: null, metadata: { label: "Stratégie défense earn-out", ref: "MA-2026-0004" } },
  { action: "time_entry_created", resource_type: "time_entry", resource_id: null, metadata: { label: "Révision SPA Series C", ref: "MA-2026-0001" } },
  { action: "mandat_generated", resource_type: "dossier", resource_id: null, metadata: { label: "Pack mandat TechScale — avenant", ref: "MA-2026-0001" } },
  { action: "intake_form_created", resource_type: "intake_form", resource_id: null, metadata: { label: "Intake prospect filiale France", ref: "TechScale France" } },
  { action: "invoice_created", resource_type: "invoice", resource_id: DEMO_INVOICES.f2026_0008, metadata: { label: "Honoraires Pilier 2", ref: "F2026-0008" } },
  { action: "dossier_created", resource_type: "dossier", resource_id: DEMO_DOSSIERS.mertens, metadata: { label: "Onboarding Mertens Capital", ref: "MA-2026-0009" } },
  { action: "dossier_updated", resource_type: "dossier", resource_id: DEMO_DOSSIERS.concurrent, metadata: { label: "Calendrier DD carve-out", ref: "MA-2026-0010" } },
  { action: "note_created", resource_type: "note", resource_id: null, metadata: { label: "Points sensibles JV Asie", ref: "MA-2026-0006" } },
  { action: "invoice_created", resource_type: "invoice", resource_id: DEMO_INVOICES.f2026_0003, metadata: { label: "Acompte phase 1 Series C", ref: "F2026-0003" } },
  { action: "time_entry_created", resource_type: "time_entry", resource_id: null, metadata: { label: "Appel coordination curateurs", ref: "MA-2026-0010" } },
  { action: "mandat_generated", resource_type: "dossier", resource_id: null, metadata: { label: "Projet mandat Distribution Group", ref: "MA-2024-0015" } },
  { action: "dossier_updated", resource_type: "dossier", resource_id: DEMO_DOSSIERS.techscale, metadata: { label: "Ajout conditions suspensives", ref: "MA-2026-0001" } },
  { action: "invoice_created", resource_type: "invoice", resource_id: DEMO_INVOICES.f2026_0014, metadata: { label: "Phase 2 honoraires VDD", ref: "F2026-0014" } },
  { action: "intake_form_created", resource_type: "intake_form", resource_id: null, metadata: { label: "Qualification litige BIH", ref: "MA-2026-0004" } },
  { action: "dossier_created", resource_type: "dossier", resource_id: DEMO_DOSSIERS.earnout, metadata: { label: "Dossier suivi post-closing", ref: "MA-2026-0004" } },
  { action: "note_created", resource_type: "note", resource_id: null, metadata: { label: "Mémo cartographie GloBE", ref: "MA-2026-0005" } },
  { action: "time_entry_created", resource_type: "time_entry", resource_id: null, metadata: { label: "Préparation réunion famille Hennin", ref: "MA-2026-0007" } },
  { action: "invoice_created", resource_type: "invoice", resource_id: DEMO_INVOICES.f2026_0017, metadata: { label: "Mandat onboarding SCSp", ref: "F2026-0017" } },
  { action: "mandat_generated", resource_type: "dossier", resource_id: null, metadata: { label: "Mandat ESOP refonte", ref: "MA-2026-0002" } },
  { action: "dossier_updated", resource_type: "dossier", resource_id: DEMO_DOSSIERS.mertens, metadata: { label: "Choix juridiction Luxembourg", ref: "MA-2026-0009" } },
  { action: "intake_form_created", resource_type: "intake_form", resource_id: null, metadata: { label: "Brief restructuration patrimoniale", ref: "MA-2026-0007" } },
  { action: "dossier_created", resource_type: "dossier", resource_id: DEMO_DOSSIERS.concurrent, metadata: { label: "Ouverture dossier carve-out", ref: "MA-2026-0010" } },
  { action: "note_created", resource_type: "note", resource_id: null, metadata: { label: "Synthèse closing TechCo", ref: "MA-2025-0042" } },
  { action: "dossier_updated", resource_type: "dossier", resource_id: DEMO_DOSSIERS.techco, metadata: { label: "Index documents data room", ref: "MA-2025-0042" } },
];

function generateDemoAuditTimestampsIso(count: number): string[] {
  const now = Date.now();
  const windowMs = 72 * 60 * 60 * 1000;
  const floor = now - windowMs;
  const stamps: number[] = [];

  for (let i = 0; i < count; i++) {
    const slice = windowMs / count;
    const jitter = Math.random() * slice * 0.85;
    const base = floor + slice * i + jitter;
    const d = new Date(base);
    const h = 9 + Math.floor(Math.random() * 10);
    const m = Math.floor(Math.random() * 60);
    d.setUTCHours(h, m, 0, 0);
    let t = d.getTime();
    if (t > now) t = now - (count - i) * 90_000;
    if (t < floor) t = floor + (i + 1) * 60_000;
    stamps.push(t);
  }

  stamps.sort((a, b) => b - a);
  return stamps.map((ts) => new Date(ts).toISOString());
}

function isAuthorized(request: NextRequest): boolean {
  const secret = request.headers.get("x-demo-secret");
  if (secret && secret === process.env.DEMO_RESET_SECRET) return true;

  const auth = request.headers.get("authorization");
  if (auth && auth === `Bearer ${process.env.CRON_SECRET}`) return true;

  return false;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();

  const { data: org } = await service
    .from("organizations")
    .select("id")
    .eq("slug", DEMO_SLUG)
    .single();

  if (!org) {
    return NextResponse.json({ error: `Org '${DEMO_SLUG}' introuvable` }, { status: 404 });
  }

  const orgId = org.id;

  // ── Étape 1 : données générées par l'activité (toutes) ──────────────────────
  const step1 = await Promise.allSettled([
    service.from("notes").delete().eq("organization_id", orgId),
    service.from("time_entries").delete().eq("organization_id", orgId),
    service.from("messages").delete().eq("organization_id", orgId),
    service.from("conflict_checks").delete().eq("organization_id", orgId),
    service.from("audit_logs").delete().eq("organization_id", orgId),
  ]);

  // ── Étape 2 : profiles/dossiers créés par des signups de test ───────────────
  // Récupérer les user_ids non-seedés dans cet org
  const { data: phantomMembers } = await service
    .from("organization_members")
    .select("user_id")
    .eq("organization_id", orgId)
    .not("user_id", "in", `(${SEED_USER_IDS.join(",")})`);

  const phantomIds = (phantomMembers ?? []).map((m) => m.user_id);

  const step2: PromiseSettledResult<unknown>[] = [];

  if (phantomIds.length > 0) {
    // Supprimer leurs dossiers (cascade timeline/documents)
    step2.push(
      ...(await Promise.allSettled([
        service.from("dossiers").delete().eq("organization_id", orgId).in("client_id", phantomIds),
        service.from("organization_members").delete().eq("organization_id", orgId).in("user_id", phantomIds),
        service.from("profiles").delete().eq("organization_id", orgId).in("id", phantomIds),
      ])),
    );
  }

  const allResults = [...step1, ...step2];
  const errors = allResults
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => String(r.reason));

  if (errors.length > 0) {
    return NextResponse.json({ reset: false, errors }, { status: 500 });
  }

  try {
    const timestamps = generateDemoAuditTimestampsIso(DEMO_AUDIT_SEED_SPECS.length);
    const rows = DEMO_AUDIT_SEED_SPECS.map((spec, i) => ({
      organization_id: orgId,
      user_id:         SEED_AVOCAT_USER_IDS[i % SEED_AVOCAT_USER_IDS.length]!,
      action:          spec.action,
      resource_type:   spec.resource_type,
      resource_id:     spec.resource_id,
      metadata:        spec.metadata,
      created_at:      timestamps[i]!,
    }));

    const { error: auditSeedError } = await service.from("audit_logs").insert(rows);
    if (auditSeedError) {
      console.error("[demo/reset] Erreur seed audit_logs:", auditSeedError.message);
    }
  } catch (e) {
    console.error("[demo/reset] Erreur seed audit_logs:", e);
  }

  return NextResponse.json({
    reset:          true,
    org:            DEMO_SLUG,
    phantoms_purged: phantomIds.length,
    timestamp:      Date.now(),
  });
}
