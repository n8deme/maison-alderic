/**
 * Inserts non-breaking spaces (\u00A0) before French double punctuation marks
 * and inside guillemets, preventing orphaned characters at line breaks.
 *
 * Applied to titles and headings — NOT to raw markdown body content.
 */
export function frenchTypography(text: string): string {
  return text
    .replace(/ \?/g, "\u00A0?")
    .replace(/ !/g, "\u00A0!")
    .replace(/ :/g, "\u00A0:")
    .replace(/ ;/g, "\u00A0;")
    .replace(/« /g, "«\u00A0")
    .replace(/ »/g, "\u00A0»");
}
