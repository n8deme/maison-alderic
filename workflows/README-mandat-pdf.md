# Workflow Mandat PDF — Maison Aldéric

> **Statut** : ✅ Production-ready
> **Version** : 1.0
> **Date** : 6 mai 2026
> **Dernière mise à jour** : 6 mai 2026 19:30

---

## 🎯 Objectif

Générer automatiquement un PDF de mandat avocat + l'enregistrer dans Supabase + envoyer 2 emails de notification (client + avocat).

---

## 📥 Endpoint
POST https://n8n.n8de.me/webhook/alderic-mandat
Content-Type: application/json

---

## 📋 Payload requis

```json
{
  "dossier_id": "uuid",
  "client_id": "uuid",
  "client_nom": "string",
  "client_email": "email",
  "avocat_id": "uuid",
  "avocat_nom": "string",
  "avocat_email": "email",
  "type_dossier": "string",
  "description": "string",
  "honoraires_estimes": number,
  "devise": "string"
}
```

### Exemple

```json
{
  "dossier_id": "b0000003-5555-4555-8555-000000000000",
  "client_id": "c0000001-2222-4222-8222-000000000001",
  "client_nom": "Élise Vandenbroucke",
  "client_email": "elise@techscale.be",
  "avocat_id": "a0000002-11f1-41f1-81f1-000000000000",
  "avocat_nom": "Sophie de Borchgrave",
  "avocat_email": "sophie@maisonalderic.be",
  "type_dossier": "M&A",
  "description": "Acquisition Concurrent SA - Due diligence et négociation",
  "honoraires_estimes": 45000,
  "devise": "EUR"
}
```

---

## 🔄 Workflow (10 nodes)

Webhook Mandat (POST)
↓
Validation données (vérifie FK)
↓ (si valide)
Format Data (génère date_signature + numero_mandat)
↓
├─→ 4. Generate HTML Template
│      ↓
│   5. HTML to PDF (PDFShift) — 86.8 kB
│      ↓
│   6. Upload PDF Supabase (bucket: documents)
│      ↓
│   7. Insert Document DB (table: documents)
│
├─→ 8. Email Client (SMTP Brevo)
│
└─→ 9. Notify Avocat (SMTP Brevo)
↓
10. Webhook Response Success


---

## ✅ Résultat

- ✅ PDF généré (template premium 8 pages)
- ✅ PDF uploadé dans Supabase Storage (`documents/mandat-xxx.pdf`)
- ✅ Entrée créée dans table `documents`
- ✅ Email HTML envoyé au client
- ✅ Email HTML envoyé à l'avocat
- ✅ Response 200 OK

---

## 🔧 Technologies

- **n8n** : orchestration
- **PDFShift** : génération PDF (API payante, crédits requis)
- **Supabase Storage** : stockage PDF (bucket `documents`)
- **Supabase DB** : table `documents` (PostgreSQL)
- **Brevo SMTP** : envoi emails (kevin@n8de.me vérifié)

---

## 🚨 Points critiques

### Credentials requis

1. **PDFShift API** : clé API active avec crédits
2. **Supabase Service Role** : Bearer token pour upload Storage + INSERT DB
3. **Brevo SMTP** : credential `a7f21d001@smtp-brevo.com` avec password

### Variables importantes

- `numero_mandat` : généré au format `MAN-20260506-0001`
- `date_signature` : format `DD/MM/YYYY à HH:mm`
- `pdf_filename` : `mandat-{{ $json.numero_mandat }}.pdf`

### Contraintes base de données

- `dossier_id` DOIT exister dans table `dossiers`
- `client_id` DOIT exister dans table `profiles`
- `avocat_id` DOIT exister dans table `avocats`

---

## 🐛 Bugs résolus (historique)

1. ✅ Authorization webhook (changé vers "None")
2. ✅ Payload BOM UTF-8 (PowerShell Invoke-RestMethod)
3. ✅ Contraintes NOT NULL (file_size, mime_type, uploaded_by)
4. ✅ Foreign Key dossier_id (création dossier test)
5. ✅ Email routing (Format Data → Email nodes)
6. ✅ Template HTML cassé (syntaxe $now.format)
7. ✅ Expéditeur email (noreply@maisonalderic.be → kevin@n8de.me)
8. ✅ Variables manquantes emails (reconnexion depuis Format Data)

---

## 📊 Temps de développement

- **Estimation initiale** : 1h
- **Temps réel** : 3h30 (debugging + optimisation template)

---

## 🔗 Fichiers liés

- Workflow JSON : `workflow-mandat-pdf-v1.json`
- Template HTML : voir node "Generate HTML Template" (code inline)
- Template email : voir nodes "Email Client" et "Notify Avocat"

---

*Documentation Kayo Agency — Projet Maison Aldéric*