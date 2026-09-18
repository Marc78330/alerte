"use server";

import { prisma } from "@/lib/prisma";
import { reportFormSchema } from "@/lib/validation";
import { generateTrackingToken } from "@/lib/tokens";
import { saveAttachmentFile } from "@/lib/storage";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 Mo

export type ReportSubmitResult =
  | { ok: true; trackingToken: string; reportId: string; suiviUrl: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitReportAction(formData: FormData): Promise<ReportSubmitResult> {
  const clubId = String(formData.get("clubId") ?? "");
  const isAnonymous = formData.get("isAnonymous") === "true";
  const isMinorVictim = formData.get("isMinorVictim") === "true";
  const allowClubOverride = formData.get("allowAnonymousFlag") === "false";
  const rawCategory = String(formData.get("categoryKey") ?? "");
  const customCategory = String(formData.get("customCategory") ?? "").trim();

  const parsed = reportFormSchema.safeParse({
    clubId,
    isAnonymous,
    reporterRole: formData.get("reporterRole"),
    categoryKey: rawCategory,
    isMinorVictim,
    reporterName: formData.get("reporterName") || null,
    reporterContact: formData.get("reporterContact") || null,
    teamCategory: formData.get("teamCategory") || null,
    description: formData.get("description"),
    locationDetail: formData.get("locationDetail") || null,
    incidentDate: formData.get("incidentDate") || null,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Formulaire invalide.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const club = await prisma.club.findUnique({ where: { id: parsed.data.clubId } });
  if (!club) {
    return { ok: false, error: "Club introuvable." };
  }

  // Catégorie "Autre situation" : on crée (ou réutilise) une catégorie AUTRE
  // avec le libellé libre du déclarant.
  let categoryKey = parsed.data.categoryKey;
  if (rawCategory === "__AUTRE__") {
    if (customCategory.length < 3) {
      return { ok: false, error: "Merci de préciser la nature des faits." };
    }
    if (customCategory.length > 100) {
      return { ok: false, error: "Nature des faits limitée à 100 caractères." };
    }
    const existing = await prisma.clubCategory.findUnique({
      where: { clubId_key: { clubId: club.id, key: "AUTRE" } },
    });
    if (existing) {
      await prisma.clubCategory.update({
        where: { id: existing.id },
        data: {
          label: customCategory,
          description: "Catégorie libre définie par le déclarant.",
          isEnabled: true,
          severity: 1,
        },
      });
    } else {
      await prisma.clubCategory.create({
        data: {
          clubId: club.id,
          key: "AUTRE",
          label: customCategory,
          description: "Catégorie libre définie par le déclarant.",
          severity: 1,
          sortOrder: 99,
        },
      });
    }
    categoryKey = "AUTRE";
  }

  const category = await prisma.clubCategory.findUnique({
    where: { clubId_key: { clubId: club.id, key: categoryKey } },
  });
  if (!category || !category.isEnabled) {
    return { ok: false, error: "Cette catégorie n'est pas disponible pour ce club." };
  }

  const wantsAnonymous = parsed.data.isAnonymous && Boolean(club.allowAnonymous || allowClubOverride);
  const severity = category.severity;

  let trackingToken = generateTrackingToken();
  let attempt = 0;
  while ((await prisma.report.findUnique({ where: { trackingToken } })) && attempt < 5) {
    trackingToken = generateTrackingToken();
    attempt++;
  }

  const incidentDate = parsed.data.incidentDate ? new Date(parsed.data.incidentDate) : null;

  const report = await prisma.report.create({
    data: {
      clubId: club.id,
      trackingToken,
      categoryKey: category.key,
      isMinorVictim: parsed.data.isMinorVictim,
      isAnonymous: wantsAnonymous,
      reporterRole: parsed.data.reporterRole,
      reporterName: wantsAnonymous ? null : parsed.data.reporterName,
      reporterContact: wantsAnonymous ? null : parsed.data.reporterContact,
      teamCategory: parsed.data.teamCategory,
      description: parsed.data.description,
      locationDetail: parsed.data.locationDetail,
      incidentDate,
      severityLevel: severity,
      status: "NOUVEAU",
    },
  });

  await logAudit(report.id, "REPORT_CREATED", "Déclarant", "Signalement reçu.");

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length > 0) {
    if (files.length > MAX_FILES) {
      return { ok: false, error: `Maximum ${MAX_FILES} pièces jointes autorisées.` };
    }
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return { ok: false, error: `Le fichier « ${file.name} » dépasse 15 Mo.` };
      }
    }
    for (const file of files) {
      try {
        const saved = await saveAttachmentFile(file);
        await prisma.attachment.create({
          data: {
            reportId: report.id,
            filePath: saved.fileName,
            originalName: saved.originalName,
            mimeType: saved.mimeType,
            size: saved.size,
          },
        });
      } catch (e) {
        console.error("Echec upload pièce jointe:", e);
      }
    }
  }

  await notifyClubByEmail(club, report.id, parsed.data.description);

  return {
    ok: true,
    trackingToken: report.trackingToken,
    reportId: report.id,
    suiviUrl: `${process.env.APP_URL ?? "http://localhost:3000"}/suivi/${report.trackingToken}`,
  };
}

export async function logAudit(
  reportId: string,
  action: string,
  actor: string,
  details?: string,
) {
  await prisma.auditLog.create({ data: { reportId, action, actor, details } });
}

/** Notification simulée vers les emails d'alerte configurés (pas de SMTP en local). */
async function notifyClubByEmail(club: { alertEmails: string; name: string }, reportId: string, description: string) {
  const recipients = club.alertEmails
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));

  console.info(
    `[ClubSafe] ✉️ Nouveau signalement reçu pour ${club.name} (${reportId}).\n` +
      `  Destinataires simulés : ${recipients.length ? recipients.join(", ") : "aucun (non renseignés)"}\n` +
      `  Extrait : ${description.slice(0, 120)}…`,
  );
}