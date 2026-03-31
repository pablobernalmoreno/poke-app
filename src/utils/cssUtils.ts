/**
 * Reads a CSS custom property from :root and parses it as an integer.
 * Falls back to the provided default if the property is missing or non-numeric.
 */
export function readIntVar(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}
