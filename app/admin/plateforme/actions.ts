"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { normalizeDomain } from "@/lib/club-url";
import { DEFAULT_CATEGORIES } from "@/lib/club-defaults";
import bcrypt from "bcryptjs";

export type PlatformResult = { ok?: boolean; error?: string };

export async function createClubAction(
  _prevState: PlatformResult,
  formData: FormData,
): Promise<PlatformResult> {
  await requireSuperAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const sport = String(formData.get("sport") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const adminEmail = String(formData.get("adminEmail") ?? "").trim().toLowerCase();
  const adminPassword = String(formData.get("adminPassword") ?? "");
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const color = String(formData.get("primaryColor") ?? "#2563eb").trim();
  const customDomain = String(formData.get("customDomain") ?? "").trim();

  if (name.length < 2) return { ok: false, error: "Nom du club requis (2 caractères min)." };
  if (!sport) return { ok: false, error: "Sport requis." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail))
    return { ok: false, error: "Email de contact invalide." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(adminEmail))
    return { ok: false, error: "Email de l'administrateur invalide." };
  if (adminPassword.length < 8)
    return { ok: false, error: "Mot de passe administrateur : 8 caractères minimum." };
  if (!/^#[0-9a-fA-F]{6}$/.test(color))
    return { ok: false, error: "Couleur invalide (format #RRGGBB)." };

  const slug = rawSlug ? slugify(rawSlug) : slugify(name);
  if (!slug) return { ok: false, error: "Impossible de générer un identifiant (slug) pour ce club." };

  const existingSlug = await prisma.club.findUnique({ where: { slug } });
  if (existingSlug) return { ok: false, error: "Cet identifiant (slug) est déjà pris." };

  const existingEmail = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existingEmail)
    return { ok: false, error: "Un compte existe déjà avec cet email administrateur." };

  let normalizedDomain: string | null = null;
  if (customDomain) {
    normalizedDomain = normalizeDomain(customDomain);
    const existingDomain = await prisma.club.findUnique({
      where: { customDomain: normalizedDomain },
    });
    if (existingDomain)
      return { ok: false, error: "Ce domaine est déjà rattaché à un club." };
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.club.create({
    data: {
      name,
      slug,
      sport,
      contactEmail,
      primaryColor: color,
      customDomain: normalizedDomain,
      categories: {
        create: DEFAULT_CATEGORIES.map((c) => ({
          key: c.key,
          label: c.label,
          description: c.description,
          severity: c.severity,
          sortOrder: c.sortOrder,
        })),
      },
      users: {
        create: {
          email: adminEmail,
          passwordHash,
          name: `Administration ${name}`,
          role: "ADMIN",
        },
      },
    },
  });

  redirect("/admin/plateforme?cree=1");
}

export async function toggleClubActiveAction(
  _prevState: PlatformResult,
  formData: FormData,
): Promise<PlatformResult> {
  await requireSuperAdmin();
  const id = String(formData.get("clubId") ?? "");
  if (!id) return { ok: false, error: "Identifiant manquant." };

  const club = await prisma.club.findUnique({ where: { id } });
  if (!club) return { ok: false, error: "Club introuvable." };

  await prisma.club.update({
    where: { id },
    data: { isActive: !club.isActive },
  });
  redirect("/admin/plateforme");
}

export async function setClubDomainAction(
  _prevState: PlatformResult,
  formData: FormData,
): Promise<PlatformResult> {
  await requireSuperAdmin();
  const id = String(formData.get("clubId") ?? "");
  const rawDomain = String(formData.get("customDomain") ?? "").trim();
  if (!id) return { ok: false, error: "Identifiant manquant." };

  const club = await prisma.club.findUnique({ where: { id } });
  if (!club) return { ok: false, error: "Club introuvable." };

  let normalizedDomain: string | null = null;
  if (rawDomain) {
    normalizedDomain = normalizeDomain(rawDomain);
    const clash = await prisma.club.findFirst({
      where: { customDomain: normalizedDomain, id: { not: id } },
    });
    if (clash) return { ok: false, error: "Ce domaine est déjà rattaché à un autre club." };
  }

  await prisma.club.update({ where: { id }, data: { customDomain: normalizedDomain } });
  redirect("/admin/plateforme");
}