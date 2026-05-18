/** Sous-domaines réservés (signup) — partagé client / serveur. */

const RESERVED_SUBDOMAINS = new Set([
  "www", "app", "admin", "demo", "api", "mail", "cdn",
  "lawyeros", "support", "help", "billing", "status",
]);

export function isReservedSubdomain(subdomain: string): boolean {
  return RESERVED_SUBDOMAINS.has(subdomain);
}

export function reservedSubdomains(): ReadonlySet<string> {
  return RESERVED_SUBDOMAINS;
}
