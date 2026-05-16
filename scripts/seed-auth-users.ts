/**
 * seed-auth-users.ts
 * Crée les auth.users manquants dans Supabase Cloud via l'Admin API.
 *
 * Usage :
 *   NEXT_PUBLIC_SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... \
 *   pnpm tsx scripts/seed-auth-users.ts
 *
 * Les UUIDs et passwords sont issus de migration 11_seed_users_avocats.sql.
 * Le script est idempotent : un user déjà existant est ignoré sans erreur.
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Service client — contourne RLS
// ---------------------------------------------------------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// ---------------------------------------------------------------------------
// Users à créer
// ---------------------------------------------------------------------------
type SeedUser = { id: string; email: string; password: string; role: "avocat" | "client" };

const USERS: SeedUser[] = [
  // ── AVOCATS ──────────────────────────────────────────────────────────────
  { id: "a0000001-1111-4111-8111-000000000001", email: "kev+alderic-vermeulen@n8de.me",  password: "MA2026!Vermeulen-Kp7n",    role: "avocat" },
  { id: "a0000002-1111-4111-8111-000000000002", email: "kev+sophie-borchgrave@n8de.me",  password: "MA2026!Borchgrave-Lm4x",   role: "avocat" },
  { id: "a0000003-1111-4111-8111-000000000003", email: "kev+jean-marc-petit@n8de.me",    password: "MA2026!Petit-Qr8v",        role: "avocat" },
  { id: "a0000004-1111-4111-8111-000000000004", email: "kev+anais-lambert@n8de.me",      password: "MA2026!Lambert-Wz2k",      role: "avocat" },
  { id: "a0000005-1111-4111-8111-000000000005", email: "kev+marc-dewinter@n8de.me",      password: "MA2026!Dewinter-Nx6j",     role: "avocat" },
  { id: "a0000006-1111-4111-8111-000000000006", email: "kev+lea-brouwers@n8de.me",       password: "MA2026!Brouwers-Ty5p",     role: "avocat" },
  { id: "a0000007-1111-4111-8111-000000000007", email: "kev+olivier-maertens@n8de.me",   password: "MA2026!Maertens-Fb3s",     role: "avocat" },
  { id: "a0000008-1111-4111-8111-000000000008", email: "kev+camille-janssens@n8de.me",   password: "MA2026!Janssens-Hc9m",     role: "avocat" },

  // ── CLIENTS ──────────────────────────────────────────────────────────────
  { id: "c0000001-2222-4222-8222-000000000001", email: "kev+client-techscale@n8de.me",   password: "MA2026!TechScale-Hx9n",    role: "client" },
  { id: "c0000002-2222-4222-8222-000000000002", email: "kev+client-industrial@n8de.me",  password: "MA2026!Industrial-Pq7r",   role: "client" },
  { id: "c0000003-2222-4222-8222-000000000003", email: "kev+client-family@n8de.me",      password: "MA2026!Family-Zt4w",       role: "client" },
  { id: "c0000004-2222-4222-8222-000000000004", email: "kev+client-entrepreneur@n8de.me",password: "MA2026!Entrepreneur-Vk2d", role: "client" },
  { id: "c0000005-2222-4222-8222-000000000005", email: "kev+client-juridique@n8de.me",   password: "MA2026!Juridique-Rm8e",    role: "client" },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\n🌱  Seed auth.users — ${USERS.length} users à traiter\n`);

  let created = 0;
  let skipped = 0;
  let failed  = 0;

  for (const user of USERS) {
    const tag = `[${user.role.toUpperCase()}] ${user.email}`;

    const { error } = await supabase.auth.admin.createUser({
      user_metadata: {},
      id:            user.id,
      email:         user.email,
      password:      user.password,
      email_confirm: true,
    });

    if (!error) {
      console.log(`  ✓  créé        ${tag}`);
      created++;
      continue;
    }

    // 422 = "User already registered" — comportement attendu en idempotence
    if (
      error.status === 422 ||
      error.message.toLowerCase().includes("already") ||
      error.message.toLowerCase().includes("duplicate")
    ) {
      console.log(`  –  déjà présent  ${tag}`);
      skipped++;
      continue;
    }

    // Erreur inattendue
    console.error(`  ✗  ERREUR      ${tag}\n     ${error.message}`);
    failed++;
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Créés   : ${created}
  Ignorés : ${skipped}
  Erreurs : ${failed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});
