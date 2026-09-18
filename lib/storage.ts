import { randomBytes } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

export const VAULT_DIR = path.join(process.cwd(), "storage", "vault");
export const LOGO_DIR = path.join(process.cwd(), "storage", "logos");

/** Nom de fichier opaque et sûr, sans le nom d'origine de l'upload. */
export function generateSafeFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const safeExt = /^\.[a-z0-9]{1,10}$/.test(ext) ? ext : "";
  return `${Date.now()}-${randomBytes(12).toString("hex")}${safeExt}`;
}

export async function saveAttachmentFile(file: File): Promise<{
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
}> {
  await mkdir(VAULT_DIR, { recursive: true });
  const safeName = generateSafeFileName(file.name);
  const target = path.join(VAULT_DIR, safeName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(target, bytes);
  return {
    fileName: safeName,
    originalName: file.name.slice(0, 255),
    mimeType: file.type || "application/octet-stream",
    size: bytes.length,
  };
}

export function resolveVaultPath(fileName: string): string {
  return path.join(VAULT_DIR, path.basename(fileName));
}

export async function removeVaultFile(fileName: string): Promise<void> {
  try {
    await unlink(resolveVaultPath(fileName));
  } catch {
    // fichier déjà absent : rien à faire
  }
}

export async function saveLogoFile(file: File): Promise<{
  fileName: string;
  mimeType: string;
  size: number;
}> {
  await mkdir(LOGO_DIR, { recursive: true });
  const safeName = generateSafeFileName(file.name);
  const target = path.join(LOGO_DIR, safeName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(target, bytes);
  return {
    fileName: safeName,
    mimeType: file.type || "application/octet-stream",
    size: bytes.length,
  };
}

export function resolveLogoPath(fileName: string): string {
  return path.join(LOGO_DIR, path.basename(fileName));
}

export async function removeLogoFile(fileName: string): Promise<void> {
  try {
    await unlink(resolveLogoPath(fileName));
  } catch {
    // fichier déjà absent : rien à faire
  }
}