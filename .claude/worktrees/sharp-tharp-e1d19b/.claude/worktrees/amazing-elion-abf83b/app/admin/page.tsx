import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const MRR_BY_PLAN: Record<string, number> = {
  solo: 79,
  cabinet: 199,
  premium: 399,
  trial: 0,
};

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "kevforma@gmail.com")
  .split(",")
  .map((e) => e.trim());

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Organization = {
  id: string;
  name: string;
  subdomain: string;
  plan: string;
  plan_interval: string;
  is_active: boolean;
  trial_ends_at: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
  member_count?: number;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function planLabel(plan: string) {
  const MAP: Record<string, string> = {
    trial: "Trial",
    solo: "Solo",
    cabinet: "Cabinet",
    premium: "Premium",
  };
  return MAP[plan] ?? plan;
}

function planColor(plan: string): { bg: string; color: string } {
  if (plan === "premium") return { bg: "#7A1F2B", color: "#ffffff" };
  if (plan === "cabinet") return { bg: "#1A1A1A", color: "#ffffff" };
  if (plan === "solo") return { bg: "#F2F0EB", color: "#1A1A1A" };
  return { bg: "#EFEDE6", color: "#5C5A55" };
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getAdminData() {
  const supabase = serviceClient();

  const now = new Date().toISOString();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: orgs } = await supabase
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false });

  if (!orgs) return null;

  const allOrgs = orgs as Organization[];

  const activeOrgs = allOrgs.filter(
    (o) => o.is_active && o.plan !== "trial"
  );
  const trialOrgs = allOrgs.filter(
    (o) => o.plan === "trial" && o.trial_ends_at && o.trial_ends_at > now
  );
  const newThisWeek = allOrgs.filter((o) => o.created_at >= weekAgo);

  const mrr = activeOrgs.reduce(
    (acc, o) => acc + (MRR_BY_PLAN[o.plan] ?? 0),
    0
  );

  // Compter les membres par org
  const { data: membersData } = await supabase
    .from("organization_members")
    .select("organization_id");

  const memberCounts: Record<string, number> = {};
  (membersData ?? []).forEach((m: { organization_id: string }) => {
    memberCounts[m.organization_id] =
      (memberCounts[m.organization_id] ?? 0) + 1;
  });

  const orgsWithCounts = allOrgs.map((o) => ({
    ...o,
    member_count: memberCounts[o.id] ?? 0,
  }));

  return {
    orgs: orgsWithCounts,
    kpis: {
      totalOrgs: allOrgs.length,
      activeOrgs: activeOrgs.length,
      trialOrgs: trialOrgs.length,
      newThisWeek: newThisWeek.length,
      mrr,
    },
  };
}

// ---------------------------------------------------------------------------
// Auth check
// ---------------------------------------------------------------------------

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  if (!ADMIN_EMAILS.includes(user.email ?? "")) redirect("/portail");
  return user;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AdminPage() {
  await checkAdminAuth();
  const data = await getAdminData();

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Erreur de chargement des données admin.
        </p>
      </div>
    );
  }

  const { kpis, orgs } = data;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Header */}
      <header
        className="border-b px-6 md:px-12 py-5 flex items-center justify-between"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div>
          <span
            className="text-xs font-medium uppercase tracking-widest block mb-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            LawyerOS
          </span>
          <h1
            className="text-xl font-heading font-medium tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Administration
          </h1>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-sm" style={{ backgroundColor: "#FEF2F2", color: "#991B1B" }}>
          Accès restreint
        </span>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-10">
        {/* KPIs */}
        <section>
          <h2
            className="text-xs font-medium uppercase tracking-widest mb-5"
            style={{ color: "var(--text-muted)" }}
          >
            Vue d'ensemble
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Organisations actives"
              value={kpis.activeOrgs}
              suffix="payantes"
            />
            <KpiCard
              label="En période d'essai"
              value={kpis.trialOrgs}
              suffix="trials actifs"
            />
            <KpiCard
              label="MRR estimé"
              value={`${kpis.mrr.toLocaleString("fr-BE")} €`}
              suffix="mensuel récurrent"
              accent
            />
            <KpiCard
              label="Nouvelles cette semaine"
              value={kpis.newThisWeek}
              suffix={`sur ${kpis.totalOrgs} total`}
            />
          </div>
        </section>

        {/* Table */}
        <section>
          <h2
            className="text-xs font-medium uppercase tracking-widest mb-5"
            style={{ color: "var(--text-muted)" }}
          >
            Organisations ({orgs.length})
          </h2>
          <div
            className="rounded-sm border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {["Nom", "Sous-domaine", "Plan", "Membres", "Créée le", "Dernière activité", "Statut"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orgs.map((org, i) => {
                    const isTrialExpired =
                      org.plan === "trial" &&
                      org.trial_ends_at &&
                      org.trial_ends_at < new Date().toISOString();

                    const status = !org.is_active
                      ? "Suspendu"
                      : isTrialExpired
                      ? "Trial expiré"
                      : org.plan === "trial"
                      ? "Trial actif"
                      : "Actif";

                    const statusColor =
                      status === "Actif"
                        ? { bg: "#F0FDF4", color: "#15803D" }
                        : status === "Trial actif"
                        ? { bg: "#EFF6FF", color: "#1D4ED8" }
                        : { bg: "#FEF2F2", color: "#B91C1C" };

                    const planStyle = planColor(org.plan);

                    return (
                      <tr
                        key={org.id}
                        className="border-b last:border-0 transition-colors"
                        style={{
                          backgroundColor:
                            i % 2 === 0 ? "var(--surface)" : "var(--background)",
                          borderColor: "var(--border-subtle)",
                        }}
                      >
                        <td className="px-4 py-3.5">
                          <p className="font-medium" style={{ color: "var(--foreground)" }}>
                            {org.name}
                          </p>
                          {org.contact_email && (
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                              {org.contact_email}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className="font-mono text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {org.subdomain}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-sm"
                            style={planStyle}
                          >
                            {planLabel(org.plan)}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3.5 font-mono text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {org.member_count}
                        </td>
                        <td
                          className="px-4 py-3.5 text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {formatDate(org.created_at)}
                        </td>
                        <td
                          className="px-4 py-3.5 text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {formatDate(org.updated_at)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-sm"
                            style={statusColor}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* MRR par plan */}
        <section>
          <h2
            className="text-xs font-medium uppercase tracking-widest mb-5"
            style={{ color: "var(--text-muted)" }}
          >
            Répartition MRR par plan
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {(["solo", "cabinet", "premium"] as const).map((plan) => {
              const count = orgs.filter((o) => o.plan === plan && o.is_active).length;
              const contribution = count * MRR_BY_PLAN[plan];
              const style = planColor(plan);
              return (
                <div
                  key={plan}
                  className="rounded-sm border p-5"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-sm"
                      style={style}
                    >
                      {planLabel(plan)}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {MRR_BY_PLAN[plan]} €/cabinet/mois
                    </span>
                  </div>
                  <p
                    className="text-2xl font-heading font-medium tracking-tight"
                    style={{ color: "var(--foreground)" }}
                  >
                    {contribution.toLocaleString("fr-BE")} €
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {count} cabinet{count > 1 ? "s" : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------

function KpiCard({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: string | number;
  suffix: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-sm border p-5"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p
        className="text-3xl font-heading font-medium tracking-tight"
        style={{ color: accent ? "var(--accent)" : "var(--foreground)" }}
      >
        {value}
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
        {suffix}
      </p>
    </div>
  );
}
