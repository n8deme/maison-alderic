import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/service";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "LawyerOS <noreply@lawyeros.app>";

// ---------------------------------------------------------------------------
// Email de bienvenue post-inscription
// ---------------------------------------------------------------------------
export async function sendWelcomeEmail({
  to,
  ownerName,
  cabinetName,
  subdomain,
}: {
  to:          string;
  ownerName:   string;
  cabinetName: string;
  subdomain:   string;
}) {
  // Toujours pointer vers lawyeros.vercel.app en production
  const portalUrl = process.env.NODE_ENV === "production"
    ? `https://lawyeros.vercel.app/portail-avocat?__tenant=${subdomain}`
    : `http://localhost:3000/portail-avocat?__tenant=${subdomain}`;

  const avocatUrl = process.env.NODE_ENV === "production"
    ? `https://lawyeros.vercel.app/portail-avocat?__tenant=${subdomain}`
    : `http://localhost:3000/portail-avocat?__tenant=${subdomain}`;

  const connexionUrl = process.env.NODE_ENV === "production"
    ? `https://lawyeros.vercel.app/connexion`
    : `http://localhost:3000/connexion`;

  await resend.emails.send({
    from:    FROM,
    to,
    subject: `Votre cabinet ${cabinetName} est actif sur LawyerOS`,
    html: welcomeHtml({ ownerName, cabinetName, subdomain, portalUrl, avocatUrl, connexionUrl, email: to }),
  });
}

// ---------------------------------------------------------------------------
// Template HTML inline — aucune dépendance externe
// Table-based layout pour compatibilité maximale email clients
// ---------------------------------------------------------------------------
function welcomeHtml({
  ownerName,
  cabinetName,
  subdomain,
  portalUrl,
  avocatUrl,
  connexionUrl,
  email,
}: {
  ownerName:    string;
  cabinetName:  string;
  subdomain:    string;
  portalUrl:    string;
  avocatUrl:    string;
  connexionUrl: string;
  email:        string;
}): string {
  const firstName = escHtml(ownerName).split(" ")[0];

  return /* html */ `
<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Bienvenue sur LawyerOS — ${escHtml(cabinetName)}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F8F7F4;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F8F7F4;padding:40px 16px 48px;">
  <tr>
    <td align="center">
      <table width="580" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;width:100%;">

        <!-- ══ LOGO ══ -->
        <tr>
          <td style="padding-bottom:28px;text-align:center;">
            <span style="font-size:20px;font-weight:600;letter-spacing:-0.03em;color:#1A1A1A;">
              Lawyer<span style="color:#7A1F2B;">OS</span>
            </span>
            <div style="width:32px;height:2px;background:#7A1F2B;margin:6px auto 0;border-radius:1px;"></div>
          </td>
        </tr>

        <!-- ══ CARTE PRINCIPALE ══ -->
        <tr>
          <td style="background:#FFFFFF;border:1px solid #E5E2DB;border-radius:3px;padding:0;overflow:hidden;">

            <!-- Bande bordeaux top -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="background:#7A1F2B;padding:20px 40px;">
                  <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.7);">
                    Cabinet activé
                  </p>
                  <p style="margin:4px 0 0;font-size:18px;font-weight:500;letter-spacing:-0.02em;color:#FFFFFF;">
                    ${escHtml(cabinetName)}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Corps -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 40px 0;">
              <tr>
                <td>
                  <p style="margin:0 0 6px;font-size:22px;font-weight:500;letter-spacing:-0.02em;color:#1A1A1A;">
                    Bonjour ${firstName},
                  </p>
                  <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#5C5A55;">
                    Votre portail LawyerOS est opérationnel. Vos clients peuvent dès maintenant accéder à leurs dossiers, documents et messages depuis leur espace dédié.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Bloc accès portail -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:0 40px;">
              <tr>
                <td style="background:#F8F7F4;border:1px solid #EFEDE6;border-radius:2px;padding:16px 20px;margin-bottom:24px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="padding-bottom:10px;">
                        <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#8B887F;">
                          Portail avocat
                        </p>
                        <a href="${escHtml(avocatUrl)}" style="font-size:13px;color:#7A1F2B;font-family:monospace;text-decoration:none;word-break:break-all;">
                          ${escHtml(avocatUrl)}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="border-top:1px solid #E5E2DB;padding-top:10px;">
                        <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#8B887F;">
                          Identifiant de connexion
                        </p>
                        <p style="margin:2px 0 0;font-size:13px;color:#1A1A1A;font-family:monospace;">
                          ${escHtml(email)}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="border-top:1px solid #E5E2DB;padding-top:10px;">
                        <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#8B887F;">
                          Identifiant cabinet
                        </p>
                        <p style="margin:2px 0 0;font-size:13px;color:#1A1A1A;font-family:monospace;">
                          ${escHtml(subdomain)}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- CTA principal -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:24px 40px 0;">
              <tr>
                <td align="center">
                  <a
                    href="${escHtml(avocatUrl)}"
                    style="display:inline-block;background:#7A1F2B;color:#FFFFFF;font-size:14px;font-weight:500;letter-spacing:0.01em;text-decoration:none;padding:13px 36px;border-radius:2px;"
                  >
                    Accéder à mon portail avocat
                  </a>
                </td>
              </tr>
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:28px 40px 0;">
              <tr>
                <td style="border-top:1px solid #F2F0EB;"></td>
              </tr>
            </table>

            <!-- Prochaines étapes -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:24px 40px 0;">
              <tr>
                <td>
                  <p style="margin:0 0 14px;font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#8B887F;">
                    Prochaines étapes
                  </p>
                </td>
              </tr>
              ${[
                {
                  num: "1",
                  title: "Créez votre premier dossier",
                  desc: "Ouvrez un dossier depuis le tableau de bord avocat et invitez un client.",
                },
                {
                  num: "2",
                  title: "Partagez le portail client",
                  desc: `Vos clients accèdent à leurs dossiers sur <a href="${escHtml(portalUrl)}" style="color:#7A1F2B;text-decoration:none;">${escHtml(portalUrl)}</a>.`,
                },
                {
                  num: "3",
                  title: "Émettez votre première facture",
                  desc: "La facturation Stripe est préconfigurée. TVA belge et française incluse.",
                },
              ].map(step => `
              <tr>
                <td style="padding-bottom:14px;">
                  <table cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="vertical-align:top;padding-right:12px;">
                        <div style="width:24px;height:24px;background:#F2F0EB;border-radius:2px;text-align:center;line-height:24px;">
                          <span style="font-size:12px;font-weight:600;color:#7A1F2B;">${step.num}</span>
                        </div>
                      </td>
                      <td>
                        <p style="margin:0 0 2px;font-size:13px;font-weight:500;color:#1A1A1A;">${step.title}</p>
                        <p style="margin:0;font-size:13px;line-height:1.5;color:#5C5A55;">${step.desc}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              `).join("")}
            </table>

            <!-- CTA secondaire connexion -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:8px 40px 36px;">
              <tr>
                <td align="center">
                  <a
                    href="${escHtml(connexionUrl)}"
                    style="display:inline-block;border:1px solid #E5E2DB;color:#1A1A1A;font-size:13px;font-weight:500;text-decoration:none;padding:10px 28px;border-radius:2px;"
                  >
                    Se connecter →
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ══ FOOTER ══ -->
        <tr>
          <td style="padding-top:24px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#8B887F;line-height:1.6;">
              Vous recevez cet email car vous avez créé un compte LawyerOS.<br />
              Votre période d'essai gratuite de 14 jours est maintenant active.
            </p>
            <p style="margin:0;font-size:11px;color:#B5B2AB;">
              © 2026 LawyerOS by Kayo Agency ·
              <a href="https://lawyeros.vercel.app/confidentialite" style="color:#B5B2AB;text-decoration:underline;">Confidentialité</a> ·
              <a href="https://lawyeros.vercel.app/cgv" style="color:#B5B2AB;text-decoration:underline;">CGV</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>
  `.trim();
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Notification email — nouveau message dans un dossier (client → avocat lead)
// Fire-and-forget : ne lance jamais d'exception vers l'appelant
// ---------------------------------------------------------------------------
export async function notifyNewMessage({
  dossierId,
  senderId,
  preview,
}: {
  dossierId: string;
  senderId:  string;
  preview:   string;
}): Promise<void> {
  try {
    const service = createServiceClient();
    const base = process.env.NODE_ENV === "production"
      ? "https://lawyeros.vercel.app"
      : "http://localhost:3000";

    // 1. Récupérer le dossier
    const { data: dossier } = await service
      .from("dossiers")
      .select("title, reference, organization_id")
      .eq("id", dossierId)
      .single();
    if (!dossier) return;

    // 2. Trouver le profil du client (sender)
    const { data: senderProfile } = await service
      .from("profiles")
      .select("full_name, email")
      .eq("id", senderId)
      .single();

    // 3. Trouver l'avocat lead via dossier_avocats → avocats → profiles
    const { data: leadRow } = await service
      .from("dossier_avocats")
      .select("avocats(user_id, full_name)")
      .eq("dossier_id", dossierId)
      .eq("role", "lead")
      .single();

      const avocatRow = (leadRow?.avocats as unknown) as { user_id: string; full_name: string } | null;
    if (!avocatRow) return;

    const { data: avocatProfile } = await service
      .from("profiles")
      .select("email")
      .eq("id", avocatRow.user_id)
      .single();
    if (!avocatProfile?.email) return;

    const clientName  = senderProfile?.full_name ?? senderProfile?.email ?? "Un client";
    const avocatName  = avocatRow.full_name ?? "Maître";
    const dossierUrl  = `${base}/portail-avocat/dossiers/${dossier.reference}`;
    const safePreview = preview.slice(0, 200);

    await resend.emails.send({
      from:    FROM,
      to:      avocatProfile.email,
      subject: `Nouveau message — ${escHtml(dossier.title)}`,
      html: messageNotifHtml({
        recipientName: avocatName,
        senderName:    clientName,
        dossierTitle:  dossier.title,
        dossierRef:    dossier.reference,
        preview:       safePreview,
        linkUrl:       dossierUrl,
        linkLabel:     "Voir le dossier",
      }),
    });
  } catch {
    // Silencieux — une notification ratée ne doit pas bloquer le workflow
  }
}

function messageNotifHtml({
  recipientName,
  senderName,
  dossierTitle,
  dossierRef,
  preview,
  linkUrl,
  linkLabel,
}: {
  recipientName: string;
  senderName:    string;
  dossierTitle:  string;
  dossierRef:    string;
  preview:       string;
  linkUrl:       string;
  linkLabel:     string;
}): string {
  return /* html */ `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F8F7F4;font-family:Inter,Helvetica,Arial,sans-serif;color:#1A1A1A;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F4;padding:40px 16px;">
  <tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

      <!-- Logo -->
      <tr><td style="padding-bottom:24px;text-align:center;">
        <span style="font-size:18px;font-weight:600;letter-spacing:-0.02em;color:#1A1A1A;">
          Lawyer<span style="color:#7A1F2B;">OS</span>
        </span>
      </td></tr>

      <!-- Carte -->
      <tr><td style="background:#FFFFFF;border:1px solid #E5E2DB;border-radius:2px;overflow:hidden;">

        <!-- Bande top -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="background:#7A1F2B;padding:16px 32px;">
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7);">Nouveau message</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:500;color:#fff;">${escHtml(dossierTitle)}</p>
            <p style="margin:2px 0 0;font-size:11px;color:rgba(255,255,255,.55);font-family:monospace;">${escHtml(dossierRef)}</p>
          </td></tr>
        </table>

        <!-- Corps -->
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 32px;">
          <tr><td>
            <p style="margin:0 0 16px;font-size:15px;color:#1A1A1A;">
              Bonjour ${escHtml(recipientName)},
            </p>
            <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#5C5A55;">
              <strong style="color:#1A1A1A;">${escHtml(senderName)}</strong> a envoyé un nouveau message dans le dossier <strong style="color:#1A1A1A;">${escHtml(dossierTitle)}</strong>.
            </p>

            <!-- Aperçu du message -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="background:#F8F7F4;border-left:3px solid #7A1F2B;padding:12px 16px;border-radius:0 2px 2px 0;">
                <p style="margin:0;font-size:13px;line-height:1.6;color:#5C5A55;font-style:italic;">"${escHtml(preview)}${preview.length >= 200 ? "…" : ""}"</p>
              </td></tr>
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${escHtml(linkUrl)}" style="display:inline-block;background:#7A1F2B;color:#fff;font-size:14px;font-weight:500;text-decoration:none;padding:12px 28px;border-radius:2px;">
                  ${escHtml(linkLabel)} →
                </a>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding-top:20px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#B5B2AB;">
          © 2026 LawyerOS by Kayo Agency
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`.trim();
}
