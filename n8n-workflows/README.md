# n8n Workflows — Maison Aldéric & Associés

4 workflows d'automatisation pour le cabinet. Tous les fichiers JSON sont importables directement dans n8n.

---

## Variables d'environnement requises

Configurer dans n8n → Settings → Variables (ou dans l'instance `.env`) :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SUPABASE_URL` | URL du projet Supabase | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Clé service role (bypass RLS) | `eyJ...` |
| `RESEND_API_KEY` | Clé API Resend pour les emails | `re_xxxx` |

Côté Next.js (`.env.local`) :

| Variable | Description |
|----------|-------------|
| `N8N_WEBHOOK_BASE_URL` | URL de l'instance n8n Hetzner | `https://n8n.maison-alderic.be` |
| `N8N_WEBHOOK_SECRET` | Secret partagé pour sécuriser les webhooks |

---

## Import dans n8n

1. Ouvrir n8n → **Workflows** → **Import from file**
2. Sélectionner le fichier JSON voulu
3. Configurer les credentials Supabase et Resend dans les nodes HTTP Request
4. Activer le workflow

> En Phase A, `N8N_WEBHOOK_BASE_URL` n'est pas défini → `lib/n8n/client.ts` stubbe les appels et logue le payload sans erreur.

---

## Workflows

### 01 — Génération mandat PDF (`01-mandat-pdf.json`)

**Déclencheur** : Webhook POST sur `/webhook/mandat-pdf`

**Déclencheur Next.js** : `POST /api/webhooks/mandat`

**Payload attendu** :
```json
{
  "client_id": "uuid",
  "dossier_id": "uuid",
  "dossier_reference": "MA-2026-001",
  "dossier_title": "Acquisition société cible",
  "triggered_by": "uuid",
  "triggered_at": "2026-05-05T09:00:00Z"
}
```

**Flux** :
1. Webhook → extraction variables
2. GET profil client (Supabase)
3. GET dossier
4. GET avocat référent (`dossier_avocats` → `profiles`)
5. Code node → génération HTML du mandat (template complet)
6. POST Supabase Storage → upload PDF (base64)
7. POST `documents` → insertion enregistrement en base
8. POST `dossier_timeline` → événement "Mandat généré"
9. Email client + email avocat (Resend, en parallèle)
10. RespondToWebhook `{ success: true, document_path }`

**Résultat** : Le mandat apparaît dans la section Documents du portail client.

---

### 02 — Relances factures impayées (`02-relances-factures.json`)

**Déclencheur** : Schedule — tous les jours à 9h00

**Logique de relance** :

| Jours de retard | Niveau actuel < | Action |
|----------------|-----------------|--------|
| ≥ 7 jours | < 1 | Email rappel poli (niveau 1) |
| ≥ 15 jours | < 2 | Email mise en demeure (niveau 2) |
| ≥ 30 jours | < 3 | Email notification interne + flag `contentieux` (niveau 3) |

**Flux** :
1. Schedule → GET factures (`status=unpaid`, `due_date < today`)
2. Code → calcul `days_overdue` et `next_level` par facture
3. Filtrage : seules les factures qui doivent être relancées passent
4. IF niveau 3 → email contentieux (interne) + PATCH `status=contentieux`
5. ELSE IF niveau 2 → email mise en demeure (client) + PATCH `reminder_level=2`
6. ELSE IF niveau 1 → email rappel poli (client) + PATCH `reminder_level=1`
7. Sinon → No-op

**Champ mis à jour** : `invoices.reminder_level` (0→1→2→3) + `last_reminder_at`

---

### 03 — Rappels rendez-vous (`03-rappels-rdv.json`)

**Déclencheur** : Schedule — tous les jours à 8h00

**Logique** :
- **J-2** (rendez-vous dans 2 jours) : email client + email briefing avocat
- **J-1** (rendez-vous demain) : email client + SMS simulé (email marqué `[SMS simulé]`)

> Le SMS réel sera branché sur Twilio/Vonage en Phase B. En Phase A, un email avec préfixe `[SMS simulé]` est envoyé à la place.

**Flux** :
1. Schedule → GET appointments (`status IN (scheduled, confirmed)`, `starts_at` entre J+1 et J+2)
2. Code → tag `J-1` ou `J-2` + formatage date/heure en français
3. IF J-1 → email J-1 client → SMS simulé
4. Sinon (J-2) → email J-2 client → email briefing avocat

---

### 04 — Onboarding client (`04-onboarding-client.json`)

**Déclencheur** : Webhook POST sur `/webhook/onboarding-client`

**Déclencheur Next.js** : `POST /api/webhooks/onboarding`

**Payload attendu** :
```json
{
  "profile_id": "uuid",
  "avocat_id": "uuid | null",
  "client_name": "Marie Dupont",
  "client_email": "marie.dupont@example.com",
  "client_company": "Dupont SA",
  "triggered_by": "uuid",
  "triggered_at": "2026-05-05T10:00:00Z"
}
```

**Flux** :
1. Webhook → GET profil client complet
2. GET avocat référent (si `avocat_id` fourni)
3. Code → consolidation variables + génération référence dossier + calcul date RDV J+7
4. POST `dossiers` → création dossier `type=conseil, status=open`
5. POST `dossier_timeline` → événement "Bienvenue — Dossier ouvert"
6. En parallèle :
   - Email bienvenue client (avec lien portail)
   - POST `appointments` → RDV consultation initiale J+7 à 10h00 (1h)
     → Email confirmation RDV client
7. RespondToWebhook `{ success: true, dossier_id, dossier_ref, rdv_scheduled_at }`

---

## Tester les webhooks en Phase A (stub)

Sans `N8N_WEBHOOK_BASE_URL`, les appels sont stubbés :

```bash
# Tester le webhook mandat via Next.js (dev local)
curl -X POST http://localhost:3000/api/webhooks/mandat \
  -H "Content-Type: application/json" \
  -H "Cookie: <session cookie>" \
  -d '{"dossier_id": "<uuid>"}'

# Tester le webhook onboarding
curl -X POST http://localhost:3000/api/webhooks/onboarding \
  -H "Content-Type: application/json" \
  -H "Cookie: <session cookie>" \
  -d '{"profile_id": "<uuid>", "avocat_id": "<uuid>"}'
```

Les routes retournent `{ "success": true, "triggered": true, "stub": true }`.

## Tester en Phase B (n8n live)

```bash
# Déclencher manuellement le workflow relances (depuis n8n UI → Execute)
# Ou simuler le schedule en cliquant "Test workflow"

# Tester le webhook mandat directement sur n8n
curl -X POST https://n8n.maison-alderic.be/webhook/mandat-pdf \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: <N8N_WEBHOOK_SECRET>" \
  -d '{ ... }'
```

---

## Sécurité webhooks

Les webhooks n8n vérifient le header `x-webhook-secret` (configurer dans le node Webhook → Authentication → Header Auth).

Côté Next.js, `lib/n8n/client.ts` envoie automatiquement ce header si `N8N_WEBHOOK_SECRET` est défini.
