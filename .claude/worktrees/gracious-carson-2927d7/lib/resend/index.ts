import { Resend } from "resend";

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
  const isProd = process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_APP_DOMAIN;
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";

  const portalUrl = isProd
    ? `https://${subdomain}.${domain}`
    : `http://localhost:3000/portail?__tenant=${subdomain}`;

  await resend.emails.send({
    from:    FROM,
    to,
    subject: `Bienvenue sur LawyerOS — ${cabinetName}`,
    html: welcomeHtml({ ownerName, cabinetName, subdomain, portalUrl }),
  });
}

// ---------------------------------------------------------------------------
// Template HTML inline (pas de dépendance React Email pour rester léger)
// ---------------------------------------------------------------------------
function welcomeHtml({
  ownerName,
  cabinetName,
  subdomain,
  portalUrl,
}: {
  ownerName:   string;
  cabinetName: string;
  subdomain:   string;
  portalUrl:   string;
}): string {
  return /* html */ `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenue sur LawyerOS</title>
</head>
<body style="margin:0;padding:0;background:#F8F7F4;font-family:Inter,Helvetica,Arial,sans-serif;color:#1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo / Marque -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <span style="font-size:18px;font-weight:600;letter-spacing:-0.02em;color:#1A1A1A;">
                LawyerOS
              </span>
            </td>
          </tr>

          <!-- Carte principale -->
          <tr>
            <td style="background:#FFFFFF;border:1px solid #E5E2DB;border-radius:2px;padding:40px;">

              <p style="margin:0 0 8px;font-size:22px;font-weight:500;letter-spacing:-0.02em;color:#1A1A1A;">
                Votre portail est prêt,&nbsp;${escHtml(ownerName).split(" ")[0]}.
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#5C5A55;font-style:italic;">
                ${escHtml(cabinetName)} est maintenant actif sur LawyerOS.
              </p>

              <!-- Lien portail -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#F2F0EB;border:1px solid #EFEDE6;border-radius:2px;padding:12px 16px;">
                    <span style="font-size:12px;color:#8B887F;display:block;margin-bottom:4px;font-family:monospace;">
                      Votre portail client
                    </span>
                    <a href="${escHtml(portalUrl)}" style="font-size:13px;color:#7A1F2B;font-family:monospace;text-decoration:none;">
                      ${escHtml(portalUrl)}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a
                      href="${escHtml(portalUrl)}"
                      style="display:inline-block;background:#7A1F2B;color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;padding:12px 32px;border-radius:2px;"
                    >
                      Accéder à mon portail
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Prochaines étapes -->
              <p style="margin:0 0 12px;font-size:13px;font-weight:500;color:#1A1A1A;">Prochaines étapes</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 8px;">
                    <p style="margin:0;font-size:13px;color:#5C5A55;">
                      <span style="color:#7A1F2B;margin-right:8px;">·</span>
                      Créez votre premier dossier depuis le portail avocat
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 8px;">
                    <p style="margin:0;font-size:13px;color:#5C5A55;">
                      <span style="color:#7A1F2B;margin-right:8px;">·</span>
                      Invitez vos collaborateurs si ce n'est pas encore fait
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin:0;font-size:13px;color:#5C5A55;">
                      <span style="color:#7A1F2B;margin-right:8px;">·</span>
                      Partagez votre portail à vos clients pour qu'ils créent leur espace
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#8B887F;">
                Vous recevez cet email car vous avez créé un compte LawyerOS.
                <br />
                Votre période d'essai de 14 jours est active.
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
