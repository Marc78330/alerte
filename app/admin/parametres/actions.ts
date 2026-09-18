"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { settingsSchema, categorySchema, passwordSchema } from "@/lib/validation";
import { saveLogoFile, removeLogoFile } from "@/lib/storage";
import bcrypt from "bcryptjs";

export type FormState = { ok?: boolean; error?: string };
export type SettingsResult = FormState;

const LOGO_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
const LOGO_MAX_BYTES = 2 * 1024 * 1024;

export async function saveClubSettingsAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();

  const parsed = settingsSchema.safeParse({
    name: formData.get("name"),
    sport: formData.get("sport"),
    contactEmail: formData.get("contactEmail"),
    primaryColor: formData.get("primaryColor"),
    welcomeMessage: formData.get("welcomeMessage"),
    allowAnonymous: formData.get("allowAnonymous") === "true",
    requireTeamInfo: formData.get("requireTeamInfo") === "true",
    alertEmails: formData.get("alertEmails"),
    landingTitle: formData.get("landingTitle") || null,
    landingSubtitle: formData.get("landingSubtitle") || null,
    landingBanner: formData.get("landingBanner") || null,
    footerMentions: formData.get("footerMentions") || null,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Paramètres invalides." };
  }

  const current = await prisma.club.findUnique({
    where: { id: admin.clubId },
    select: { logoFileName: true },
  });

  let logoFileName = current?.logoFileName ?? null;
  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    const ext = logo.name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[0] ?? "";
    const allowedMime = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"].includes(logo.type);
    if (!allowedMime || !LOGO_EXTENSIONS.includes(ext)) {
      return { ok: false, error: "Logo invalide : PNG, JPG, GIF, WEBP ou SVG uniquement." };
    }
    if (logo.size > LOGO_MAX_BYTES) {
      return { ok: false, error: "Logo trop volumineux : 2 Mo maximum." };
    }
    const saved = await saveLogoFile(logo);
    if (current?.logoFileName) {
      await removeLogoFile(current.logoFileName);
    }
    logoFileName = saved.fileName;
  }

  const removeLogo = formData.get("removeLogo") === "true";
  if (removeLogo && logoFileName) {
    await removeLogoFile(logoFileName);
    logoFileName = null;
  }

  await prisma.club.update({
    where: { id: admin.clubId },
    data: { ...parsed.data, logoFileName },
  });

  return { ok: true };
}

export async function saveCategoryAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();

  const parsed = categorySchema.safeParse({
    id: formData.get("id") || undefined,
    key: formData.get("key"),
    label: formData.get("label"),
    description: formData.get("description"),
    severity: formData.get("severity"),
    isEnabled: formData.get("isEnabled") === "true",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Catégorie invalide." };
  }

  const existing = parsed.data.id
    ? await prisma.clubCategory.findFirst({
        where: { id: parsed.data.id, clubId: admin.clubId },
      })
    : null;

  const duplicate = await prisma.clubCategory.findUnique({
    where: { clubId_key: { clubId: admin.clubId, key: parsed.data.key } },
  });
  if (duplicate && duplicate.id !== existing?.id) {
    return { ok: false, error: "Cette clé existe déjà pour ce club." };
  }

  if (existing) {
    await prisma.clubCategory.update({
      where: { id: existing.id },
      data: {
        key: parsed.data.key,
        label: parsed.data.label,
        description: parsed.data.description,
        severity: parsed.data.severity,
        isEnabled: parsed.data.isEnabled,
      },
    });
  } else {
    const count = await prisma.clubCategory.count({ where: { clubId: admin.clubId } });
    await prisma.clubCategory.create({
      data: {
        clubId: admin.clubId,
        key: parsed.data.key,
        label: parsed.data.label,
        description: parsed.data.description,
        severity: parsed.data.severity,
        isEnabled: parsed.data.isEnabled,
        sortOrder: count + 1,
      },
    });
  }

  return { ok: true };
}

export async function deleteCategoryAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Identifiant manquant." };

  const existing = await prisma.clubCategory.findFirst({
    where: { id, clubId: admin.clubId },
  });
  if (!existing) return { ok: false, error: "Catégorie introuvable." };

  await prisma.clubCategory.delete({ where: { id } });
  return { ok: true };
}

export async function changePasswordAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Mot de passe invalide." };
  }

  const user = await prisma.user.findUnique({ where: { id: admin.id } });
  if (!user) return { ok: false, error: "Compte introuvable." };

  const match = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!match) return { ok: false, error: "Le mot de passe actuel est incorrect." };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: admin.id }, data: { passwordHash } });

  return { ok: true };
}