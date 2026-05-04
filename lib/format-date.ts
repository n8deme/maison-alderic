const fmt = new Intl.DateTimeFormat("fr-BE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDateFr(dateStr: string): string {
  return fmt.format(new Date(dateStr));
}
