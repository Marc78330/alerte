/**
 * Session HTTP-only signée (HMAC-SHA256) via WebCrypto.
 * Compatible Edge (middleware) et Node (server actions / routes).
 */

export const SESSION_COOKIE = "clubsafe_session";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

function secretBytes(): Uint8Array<ArrayBuffer> {
  const secret = process.env.SESSION_SECRET ?? "clubsafe-insecure-dev-secret";
  return new TextEncoder().encode(secret);
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    secretBytes(),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export function encodeB64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeB64url(input: string): Uint8Array<ArrayBuffer> {
  let normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  while (normalized.length % 4 !== 0) normalized += "=";
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sign(data: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return encodeB64url(new Uint8Array(sig));
}

export async function createSessionToken(payload: { userId: string; email: string }): Promise<string> {
  const body = encodeB64url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await sign(body);
  return `${body}.${signature}`;
}

export async function verifySessionToken(token: string | undefined): Promise<{ userId: string; email: string } | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, signature] = parts;
  try {
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeB64url(signature),
      new TextEncoder().encode(body),
    );
    if (!valid) return null;
    const parsed = JSON.parse(new TextDecoder().decode(decodeB64url(body))) as {
      userId: string;
      email: string;
    };
    if (!parsed.userId || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}