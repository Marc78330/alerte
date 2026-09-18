"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { POSTER_STYLES } from "./poster-types";

export type StyleState = { ok?: boolean; error?: string };

export async function savePosterStyleAction(
  _prevState: StyleState,
  formData: FormData,
): Promise<StyleState> {
  const admin = await requireAdmin();

  const style = String(formData.get("posterStyle") ?? "");
  const valid = POSTER_STYLES.some((s) => s.id === style);
  if (!valid) {
    return { ok: false, error: "Style d'affiche inconnu." };
  }

  await prisma.club.update({
    where: { id: admin.clubId },
    data: { posterStyle: style },
  });

  return { ok: true };
}