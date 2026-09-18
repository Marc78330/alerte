"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validation";
import { normalizeTrackingToken, isValidTrackingToken } from "@/lib/tokens";
import { logAudit } from "@/app/actions/report";

export type SendMessageResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string };

export type LookupResult = { error?: string };

export async function lookupSuiviAction(
  _prevState: LookupResult,
  formData: FormData,
): Promise<LookupResult> {
  const token = normalizeTrackingToken(String(formData.get("token") ?? ""));
  if (!isValidTrackingToken(token)) {
    return { error: "Ce code est invalide. Format attendu : SAFE-XXXX-XXXX." };
  }
  const report = await prisma.report.findUnique({
    where: { trackingToken: token },
    select: { id: true },
  });
  if (!report) {
    return { error: "Aucun dossier ne correspond à ce code." };
  }
  redirect(`/suivi/${token}`);
}

export async function sendSuiviMessageAction(formData: FormData): Promise<SendMessageResult> {
  const token = normalizeTrackingToken(String(formData.get("token") ?? ""));
  if (!isValidTrackingToken(token)) {
    return { ok: false, error: "Ce code de suivi est invalide." };
  }
  const parsed = messageSchema.safeParse({
    reportId: String(formData.get("reportId") ?? ""),
    content: String(formData.get("content") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Message invalide." };
  }

  const report = await prisma.report.findFirst({
    where: { id: parsed.data.reportId, trackingToken: token },
    select: { id: true },
  });
  if (!report) return { ok: false, error: "Ce dossier n'est pas accessible avec ce code." };

  const msg = await prisma.reportMessage.create({
    data: {
      reportId: report.id,
      senderType: "REPORTER",
      content: parsed.data.content,
    },
  });

  await prisma.report.update({
    where: { id: report.id },
    data: { updatedAt: new Date() },
  });
  await logAudit(report.id, "REPORTER_MESSAGE", "Déclarant", "Nouveau message du déclarant.");

  return { ok: true, messageId: msg.id };
}