import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

const DEMO_SLUG = "maison-alderic";

function isAuthorized(request: NextRequest): boolean {
  // Auth via header X-Demo-Secret (appels directs)
  const secret = request.headers.get("x-demo-secret");
  if (secret && secret === process.env.DEMO_RESET_SECRET) return true;

  // Auth via Authorization: Bearer <CRON_SECRET> (crons Vercel)
  const auth = request.headers.get("authorization");
  if (auth && auth === `Bearer ${process.env.CRON_SECRET}`) return true;

  return false;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();

  // Trouver l'org de démo
  const { data: org } = await service
    .from("organizations")
    .select("id")
    .eq("slug", DEMO_SLUG)
    .single();

  if (!org) {
    return NextResponse.json({ error: `Org '${DEMO_SLUG}' introuvable` }, { status: 404 });
  }

  const orgId = org.id;

  // Supprimer les données utilisateur générées — dans l'ordre des FK
  const deletions = await Promise.allSettled([
    service.from("notes").delete().eq("organization_id", orgId),
    service.from("time_entries").delete().eq("organization_id", orgId),
    service.from("messages").delete().eq("organization_id", orgId),
    service.from("conflict_checks").delete().eq("organization_id", orgId),
    service.from("audit_logs").delete().eq("organization_id", orgId),
  ]);

  const errors = deletions
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => String(r.reason));

  if (errors.length > 0) {
    return NextResponse.json(
      { reset: false, errors },
      { status: 500 },
    );
  }

  return NextResponse.json({
    reset: true,
    org:   DEMO_SLUG,
    timestamp: Date.now(),
  });
}
