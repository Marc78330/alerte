import { createHash, randomBytes } from "crypto";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sans I, L, O, 0, 1

function randomChar(): string {
  const bytes = randomBytes(1);
  return ALPHABET[bytes[0] % ALPHABET.length];
}

function checksumChar(source: string): string {
  const digest = createHash("sha256").update(`clubsafe:${source}`).digest("base64url");
  return ALPHABET[digest.charCodeAt(0) % ALPHABET.length];
}

/**
 * Génère un jeton de suivi lisible au format SAFE-XXXX-XXXX.
 * Le dernier caractère est un caractère de contrôle pour détecter les
 * erreurs de saisie lors de la saisie manuelle.
 */
export function generateTrackingToken(): string {
  const first = Array.from({ length: 4 }, randomChar).join("");
  const second = Array.from({ length: 3 }, randomChar).join("");
  return `SAFE-${first}-${second}${checksumChar(`${first}${second}`)}`;
}

/** Vérifie la syntaxe d'un jeton (et son caractère de contrôle). */
export function isValidTrackingToken(token: string): boolean {
  const m = /^SAFE-([A-HJKMNP-Z2-9]{4})-([A-HJKMNP-Z2-9]{4})$/.exec(token);
  if (!m) return false;
  return checksumChar(`${m[1]}${m[2].slice(0, 3)}`) === m[2].charAt(3);
}

export function normalizeTrackingToken(token: string): string {
  return token.trim().toUpperCase().replace(/\s/g, "");
}