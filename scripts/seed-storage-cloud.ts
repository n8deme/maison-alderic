/**
 * Seed le bucket Supabase Storage Cloud "documents" avec un PDF placeholder
 * pour chaque row de `documents` dont le file_path n'existe pas encore.
 *
 * Implémentation via fetch (REST PostgREST + Storage) pour éviter les soucis
 * de résolution pnpm / @supabase/supabase-js sur certains postes.
 *
 * Usage :
 *   pnpm tsx scripts/seed-storage-cloud.ts
 *
 * .env.production.local :
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from "dotenv";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

config({ path: ".env.production.local" });

const BORDEAUX = rgb(122 / 255, 31 / 255, 43 / 255);
const COLOR_FOOTER_GRAY = rgb(0.62, 0.62, 0.62);
const COLOR_HEADER_GRAY = rgb(0.2, 0.2, 0.2);
const COLOR_BODY_GRAY = rgb(0.45, 0.45, 0.45);

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv(): void {
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error(
      "❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis (.env.production.local).",
    );
    process.exit(1);
  }
  if (SUPABASE_URL.includes("127.0.0.1") || SUPABASE_URL.includes("localhost")) {
    console.error("❌ Utilise l’URL Supabase Cloud (pas localhost).");
    process.exit(1);
  }
}

const authHeaders = {
  apikey: SERVICE_ROLE!,
  Authorization: `Bearer ${SERVICE_ROLE}`,
} as const;

type DocRow = {
  id: string;
  name: string | null;
  file_path: string;
  mime_type: string | null;
  dossier_id: string;
};

async function fetchDocuments(): Promise<DocRow[]> {
  const qs = new URLSearchParams({
    select: "id,name,file_path,mime_type,dossier_id",
    order: "created_at.asc",
  });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/documents?${qs}`, {
    headers: { ...authHeaders, Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`PostgREST ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function objectExists(folder: string, filename: string): Promise<boolean> {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/documents`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      prefix: folder,
      search: filename,
      limit: 100,
      offset: 0,
    }),
  });
  if (!res.ok) {
    console.warn(`⚠️  list(${folder}) ${res.status}, on tente upload quand même`);
    return false;
  }
  const items: { name: string }[] = await res.json();
  return (items ?? []).some((f) => f.name === filename);
}

function encodeStorageObjectPath(path: string): string {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function uploadObject(filePath: string, pdfBuffer: Uint8Array): Promise<void> {
  const pathEnc = encodeStorageObjectPath(filePath);
  const url = `${SUPABASE_URL}/storage/v1/object/documents/${pathEnc}?upsert=true`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": "application/pdf",
    },
    body: pdfBuffer,
  });
  if (!res.ok) {
    throw new Error(`${res.status}: ${await res.text()}`);
  }
}

async function buildPlaceholderPDF(
  docName: string,
  filePath: string,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const dossierUuid = filePath.split("/")[0];
  const dateStr = new Date().toLocaleDateString("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const margin = 48;
  const pageW = 595;
  const centerX = pageW / 2;

  const headerLine = "MAISON ALDÉRIC & ASSOCIÉS";
  const subLine = "Avenue Louise 480, 1050 Bruxelles";

  const topY = 780;
  const headerW = helveticaBold.widthOfTextAtSize(headerLine, 16);
  page.drawText(headerLine, {
    x: centerX - headerW / 2,
    y: topY,
    size: 16,
    font: helveticaBold,
    color: COLOR_HEADER_GRAY,
  });

  const subW = helvetica.widthOfTextAtSize(subLine, 9);
  page.drawText(subLine, {
    x: centerX - subW / 2,
    y: topY - 20,
    size: 9,
    font: helvetica,
    color: COLOR_BODY_GRAY,
  });

  const lineY = topY - 34;
  page.drawLine({
    start: { x: margin, y: lineY },
    end: { x: pageW - margin, y: lineY },
    thickness: 1.5,
    color: BORDEAUX,
  });

  const nameSize = 22;
  const maxNameW = pageW - 2 * margin;
  const nameLines: string[] = [];
  if (helveticaBold.widthOfTextAtSize(docName, nameSize) <= maxNameW) {
    nameLines.push(docName);
  } else {
    const words = docName.split(/\s+/);
    let line = "";
    for (const w of words) {
      const candidate = line ? `${line} ${w}` : w;
      if (helveticaBold.widthOfTextAtSize(candidate, nameSize) <= maxNameW) {
        line = candidate;
      } else {
        if (line) nameLines.push(line);
        line = w;
      }
    }
    if (line) nameLines.push(line);
  }

  let nameY = lineY - 80;
  for (const line of nameLines) {
    const w = helveticaBold.widthOfTextAtSize(line, nameSize);
    page.drawText(line, {
      x: centerX - w / 2,
      y: nameY,
      size: nameSize,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    nameY -= nameSize + 6;
  }

  const confidential = "Document confidentiel";
  const confW = helveticaOblique.widthOfTextAtSize(confidential, 11);
  page.drawText(confidential, {
    x: centerX - confW / 2,
    y: nameY - 28,
    size: 11,
    font: helveticaOblique,
    color: COLOR_BODY_GRAY,
  });

  const dossierLbl = `Référence dossier : ${dossierUuid}`;
  const dossierW = helvetica.widthOfTextAtSize(dossierLbl, 10);
  page.drawText(dossierLbl, {
    x: centerX - dossierW / 2,
    y: nameY - 54,
    size: 10,
    font: helvetica,
    color: COLOR_BODY_GRAY,
  });

  const dateLine = `Date : ${dateStr}`;
  const dateW = helvetica.widthOfTextAtSize(dateLine, 10);
  page.drawText(dateLine, {
    x: centerX - dateW / 2,
    y: nameY - 74,
    size: 10,
    font: helvetica,
    color: COLOR_BODY_GRAY,
  });

  const footerText =
    "Ce document est un placeholder pour la démonstration.\nLe contenu réel serait visible ici dans un environnement de production.";
  let fy = 100;
  for (const fLine of footerText.split("\n")) {
    const fw = helvetica.widthOfTextAtSize(fLine, 9);
    page.drawText(fLine, {
      x: centerX - fw / 2,
      y: fy,
      size: 9,
      font: helvetica,
      color: COLOR_FOOTER_GRAY,
    });
    fy -= 14;
  }

  return pdf.save();
}

async function main() {
  requireEnv();

  const docs = await fetchDocuments();

  console.log(`📋 ${docs.length} documents trouvés en DB\n`);

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const doc of docs) {
    const folder = doc.file_path.split("/")[0];
    const filename = doc.file_path.split("/").slice(1).join("/");

    if (await objectExists(folder, filename)) {
      console.log(`⏭️  Skip (déjà uploadé) : ${doc.file_path}`);
      skipped++;
      continue;
    }

    let pdfBuffer: Uint8Array;
    try {
      pdfBuffer = await buildPlaceholderPDF(doc.name ?? filename, doc.file_path);
    } catch (e) {
      console.error(`❌ Erreur génération PDF ${doc.file_path}:`, e);
      errors++;
      continue;
    }

    try {
      await uploadObject(doc.file_path, pdfBuffer);
      console.log(`✅ Upload : ${doc.file_path}`);
      uploaded++;
    } catch (e) {
      console.error(`❌ Erreur ${doc.file_path}:`, e);
      errors++;
    }
  }

  console.log(`\n🎉 Terminé !`);
  console.log(`   ✅ Uploadés : ${uploaded}`);
  console.log(`   ⏭️  Skip : ${skipped}`);
  console.log(`   ❌ Erreurs : ${errors}`);

  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
