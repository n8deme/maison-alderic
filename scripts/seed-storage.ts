/**
 * Seed Supabase Storage avec des fichiers dummy correspondant aux file_path
 * du seed `20260504121200_13_seed_portail.sql`.
 *
 * Usage (PowerShell):
 *   $env:SUPABASE_SERVICE_ROLE_KEY="<service_role_key>"
 *   pnpm seed:storage
 *
 * Récupérer la clé via `npx supabase status` (clé "service_role key").
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY manquante. Récupère-la via `npx supabase status`.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

// Minimal valid PDF (1 page, blank)
const DUMMY_PDF = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 100 700 Td (Dummy PDF) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000317 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n409\n%%EOF",
);

// Minimal valid DOCX/XLSX (empty ZIP — won't open as Office, but valid file)
const DUMMY_OFFICE = Buffer.from([
  0x50, 0x4b, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]);

const FILES = [
  // TechScale Series C
  { path: "e0000001-5555-4555-8555-000000000001/mandat-series-c.pdf",       type: "application/pdf" },
  { path: "e0000001-5555-4555-8555-000000000001/term-sheet-final.pdf",      type: "application/pdf" },
  { path: "e0000001-5555-4555-8555-000000000001/vdd-legal-v3.pdf",          type: "application/pdf" },
  { path: "e0000001-5555-4555-8555-000000000001/spa-draft-4.docx",          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  { path: "e0000001-5555-4555-8555-000000000001/memo-drag-along.docx",      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  // ESOP
  { path: "e0000002-5555-4555-8555-000000000002/esop-plan-rules.pdf",       type: "application/pdf" },
  { path: "e0000002-5555-4555-8555-000000000002/liste-beneficiaires.xlsx",  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  // Filiale France
  { path: "e0000003-5555-4555-8555-000000000003/statuts-sas-projet.pdf",    type: "application/pdf" },
  // BIH × TechCo (closed)
  { path: "f0000001-5555-4555-8555-000000000004/spa-techco-signe.pdf",      type: "application/pdf" },
  { path: "f0000001-5555-4555-8555-000000000004/mandat-bih-techco.pdf",     type: "application/pdf" },
  { path: "f0000001-5555-4555-8555-000000000004/closing-memo.pdf",          type: "application/pdf" },
  // Earn-out
  { path: "f0000002-5555-4555-8555-000000000005/notification-desaccord.pdf", type: "application/pdf" },
  { path: "f0000002-5555-4555-8555-000000000005/memoire-bih.pdf",           type: "application/pdf" },
  // Pilier 2
  { path: "f0000003-5555-4555-8555-000000000006/carto-globe.xlsx",          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { path: "f0000003-5555-4555-8555-000000000006/memo-pilier2.pdf",          type: "application/pdf" },
  // JV Asie
  { path: "f0000004-5555-4555-8555-000000000007/loi-partenaire-jp.pdf",     type: "application/pdf" },
  // Hennin restructuration
  { path: "c0000001-5555-4555-8555-000000000009/audit-patrimonial.pdf",     type: "application/pdf" },
  { path: "c0000001-5555-4555-8555-000000000009/pacte-familial-d1.docx",    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  // Mertens Capital
  { path: "d0000001-5555-4555-8555-000000000011/memorandum.pdf",            type: "application/pdf" },
  { path: "d0000001-5555-4555-8555-000000000011/lpa-template.pdf",          type: "application/pdf" },
  // DG acquisition concurrent
  { path: "b0000003-5555-4555-8555-000000000014/loi-curateurs.pdf",         type: "application/pdf" },
  { path: "b0000003-5555-4555-8555-000000000014/dd-legale-interim.pdf",     type: "application/pdf" },
];

async function seedStorage() {
  console.log(`Upload de ${FILES.length} fichiers dummy dans bucket "documents"...\n`);

  let ok = 0;
  let fail = 0;

  for (const file of FILES) {
    const body = file.type === "application/pdf" ? DUMMY_PDF : DUMMY_OFFICE;
    const { error } = await supabase.storage
      .from("documents")
      .upload(file.path, body, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error(`❌ ${file.path} — ${error.message}`);
      fail++;
    } else {
      console.log(`✅ ${file.path}`);
      ok++;
    }
  }

  console.log(`\n${ok} uploadés, ${fail} échecs.`);
  process.exit(fail > 0 ? 1 : 0);
}

seedStorage().catch((err) => {
  console.error(err);
  process.exit(1);
});
