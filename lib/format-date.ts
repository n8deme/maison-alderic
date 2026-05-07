const fmt = new Intl.DateTimeFormat("fr-BE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const fmtShort = new Intl.DateTimeFormat("fr-BE", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDateFr(dateStr: string): string {
  return fmt.format(new Date(dateStr));
}

export function formatDateFrLong(dateStr: string): string {
  return fmt.format(new Date(dateStr));
}

export function formatDateFrShort(dateStr: string): string {
  return fmtShort.format(new Date(dateStr));
}
