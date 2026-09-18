/**
 * Résolution des URLs publiques d'un club.
 * - Si un domaine custom est configuré, l'URL racine de ce domaine sert de
 *   point d'entrée (proxy.ts renverra / vers /club/{slug}/signalement).
 * - Sinon, l'URL conventionnelle /club/{slug}/signalement sur le domaine hôte.
 */

export function normalizeDomain(input: string): string {
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "");
  value = value.replace(/\/.*$/, "");
  value = value.replace(/^www\./, "");
  return value;
}

export function clubPublicUrl(club: {
  slug: string;
  customDomain: string | null;
}): string {
  if (club.customDomain) return `https://${club.customDomain}`;
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return `${base}/club/${club.slug}/signalement`;
}

export function clubTrackingUrl(club: {
  slug: string;
  customDomain: string | null;
}): string {
  return clubPublicUrl(club);
}