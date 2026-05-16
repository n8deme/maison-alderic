/**
 * Helper pour déclencher les webhooks n8n depuis Next.js (Server Actions / Route Handlers).
 * En Phase A : N8N_WEBHOOK_BASE_URL n'est pas configuré → log l'appel et retourne un stub.
 * En Phase B : pointer sur l'URL Hetzner réelle.
 */

const BASE = process.env.N8N_WEBHOOK_BASE_URL ?? "";
const SECRET = process.env.N8N_WEBHOOK_SECRET ?? "";

export type N8nWebhookPath = "mandat-pdf" | "onboarding-client";

export interface N8nResponse {
  triggered: boolean;
  stub?: boolean;
  data?: unknown;
}

export async function triggerN8nWebhook(
  path: N8nWebhookPath,
  payload: Record<string, unknown>,
): Promise<N8nResponse> {
  if (!BASE) {
    console.log(`[n8n stub] Would trigger /${path} with payload:`, payload);
    return { triggered: true, stub: true };
  }

  const url = `${BASE}/webhook/${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(SECRET ? { "x-webhook-secret": SECRET } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`n8n webhook failed: ${res.status} ${await res.text()}`);
  }

  return { triggered: true, data: await res.json().catch(() => null) };
}
