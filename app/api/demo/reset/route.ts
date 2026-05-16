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

  return NextResponse.json({
    reset:          true,
    org:            DEMO_SLUG,
    phantoms_purged: phantomIds.length,
    timestamp:      Date.now(),
  });
}
