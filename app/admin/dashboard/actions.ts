"use server";

import { prisma } from "@/lib/prisma";
import { statusSchema, messageSchema } from "@/lib/validation";
import { logAudit } from "@/app/actions/report";
import type { ReportStatus } from "@/lib/constants";

export type StatusResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateReportStatusAction(formData: FormData): Promise<StatusResult> {
  const parsed = statusSchema.safeParse({
    reportId: formData.get("reportId"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Paramètres invalides." };
  }

  const report = await prisma.report.findUnique({ where: { id: parsed.data.reportId } });
  if (!report) return { ok: false, error: "Signalement introuvable." };

  await prisma.report.update({
    where: { id: parsed.data.reportId },
    data: { status: parsed.data.status as ReportStatus },
  });

  await logAudit(
    parsed.data.reportId,
    "STATUS_CHANGED",
    "Bureau du club",
    `Statut changé de « ${report.status} » vers « ${parsed.data.status} »`,
  );

  return { ok: true };
}

export async function sendAdminMessageAction(formData: FormData): Promise<StatusResult> {
  const parsed = messageSchema.safeParse({
    reportId: formData.get("reportId"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Message invalide." };
  }

  const report = await prisma.report.findUnique({ where: { id: parsed.data.reportId } });
  if (!report) return { ok: false, error: "Signalement introuvable." };

  await prisma.reportMessage.create({
    data: {
      reportId: parsed.data.reportId,
      senderType: "ADMIN",
      content: parsed.data.content,
    },
  });

  await prisma.report.update({
    where: { id: parsed.data.reportId },
    data: { updatedAt: new Date() },
  });

  await logAudit(parsed.data.reportId, "ADMIN_MESSAGE", "Bureau du club", "Nouveau message au déclarant.");

  return { ok: true };
}