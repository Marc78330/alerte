import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clubLogoUrl } from "@/lib/club-logo";
import { AdminNav } from "@/app/admin/_components/admin-nav";
import { StatusSelector } from "./status-selector";
import { AdminChat } from "./admin-chat";
import { LegalModule } from "./legal-module";
import { FileText, Frown, Clock, ShieldAlert, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/constants";

export const metadata: Metadata = { title: "Dossier — ClubSafe" };

type Props = { params: Promise<{ id: string }> };

export default async function ReportDetailPage({ params }: Props) {
  const { id } = await params;
  const admin = await requireAdmin();

  const report = await prisma.report.findFirst({
    where: { id, clubId: admin.clubId },
    include: {
      club: { select: { primaryColor: true, slug: true, logoFileName: true } },
      messages: { orderBy: { createdAt: "asc" } },
      attachments: true,
      auditLogs: { orderBy: { timestamp: "asc" } },
    },
  });

  if (!report) notFound();

  const category = await prisma.clubCategory.findUnique({
    where: { clubId_key: { clubId: admin.clubId, key: report.categoryKey } },
  });

  const isMinor = report.isMinorVictim;

  return (
    <main className="min-h-screen bg-slate-100 pb-16">
      <AdminNav
          backHref="/admin/dashboard"
          backLabel="Tous les dossiers"
          logoSrc={report.club.logoFileName ? clubLogoUrl(report.club.slug) : null}
          isSuperAdmin={admin.role === "SUPER_ADMIN"}
        />
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dossier de signalement</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Code de suivi : <b className="font-mono">{report.trackingToken}</b> · reçu le
              {formatDate(report.createdAt)}
            </p>
          </div>
          {isMinor && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1.5 text-xs font-bold text-white">
              <ShieldAlert className="h-3.5 w-3.5" /> VICTIME MINEURE — priorité absolue
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="space-y-6 lg:col-span-2">
            {/* Résumé */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    report.severityLevel === 3
                      ? "bg-red-600 text-white"
                      : report.severityLevel === 2
                        ? "bg-amber-500 text-white"
                        : "bg-slate-600 text-white"
                  }`}
                >
                  {report.severityLevel === 3
                    ? "Niveau 3 — Signalement obligatoire"
                    : report.severityLevel === 2
                      ? "Niveau 2 — Mesure conservatoire"
                      : "Niveau 1 — Médiation"}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {category?.label ?? report.categoryKey}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Déclaré en tant que {report.reporterRole}
                </span>
              </div>

              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-xs font-medium text-slate-500">Anonymat</dt>
                  <dd className="mt-0.5 font-semibold text-slate-900">
                    {report.isAnonymous ? "Déclarant anonyme" : "Identité confidentielle"}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-xs font-medium text-slate-500">Victime mineure</dt>
                  <dd className="mt-0.5 font-semibold text-slate-900">
                    {isMinor ? "Oui" : "Non renseigné"}
                  </dd>
                </div>
                {!report.isAnonymous && (
                  <>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="text-xs font-medium text-slate-500">Nom du déclarant</dt>
                      <dd className="mt-0.5 font-semibold text-slate-900">
                        {report.reporterName ?? "Non renseigné"}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="text-xs font-medium text-slate-500">Contact</dt>
                      <dd className="mt-0.5 font-semibold text-slate-900">
                        {report.reporterContact ?? "Non renseigné"}
                      </dd>
                    </div>
                  </>
                )}
                {report.teamCategory && (
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs font-medium text-slate-500">Équipe concernée</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900">{report.teamCategory}</dd>
                  </div>
                )}
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-xs font-medium text-slate-500">Date des faits</dt>
                  <dd className="mt-0.5 font-semibold text-slate-900">
                    {report.incidentDate
                      ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(report.incidentDate)
                      : "Non renseignée"}
                  </dd>
                </div>
                {report.locationDetail && (
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs font-medium text-slate-500">Lieu des faits</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900">{report.locationDetail}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-4 rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-slate-700">
                {report.description}
              </div>
            </section>

            {/* Pièces jointes */}
            {report.attachments.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Pièces jointes ({report.attachments.length})
                </h2>
                <ul className="mt-3 space-y-2">
                  {report.attachments.map((a) => (
                    <li key={a.id}>
                      <a
                        href={`/api/files/${a.id}`}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm transition hover:bg-slate-50"
                      >
                        <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="min-w-0 flex-1 truncate text-slate-700">{a.originalName}</span>
                        <span className="text-xs text-slate-400">
                          {(a.size / 1024).toFixed(0)} Ko · {new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(a.createdAt)}
                        </span>
                        <span className="text-xs font-semibold text-blue-600">Télécharger</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Historique d'audit */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Historique d&apos;audit
              </h2>
              <ol className="mt-4 space-y-0">
                {report.auditLogs.map((log, i) => (
                  <li key={log.id} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < report.auditLogs.length - 1 && (
                      <span className="absolute left-[13px] top-7 h-full w-px bg-slate-200" />
                    )}
                    <span
                      className={`mt-1 h-[7px] w-[7px] shrink-0 rounded-full ${
                        i === 0 ? "bg-blue-500" : "bg-slate-300"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{log.action}</p>
                      {log.details && <p className="text-xs text-slate-500">{log.details}</p>}
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" /> {formatDate(log.timestamp)} par {log.actor}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            <StatusSelector
              reportId={report.id}
              currentStatus={report.status}
              createdAt={report.createdAt.toISOString()}
            />

            <AdminChat
              reportId={report.id}
              trackingToken={report.trackingToken}
              primaryColor={report.club.primaryColor}
              messages={report.messages.map((m) => ({
                id: m.id,
                senderType: m.senderType,
                content: m.content,
                createdAt: m.createdAt.toISOString(),
              }))}
              isAnonymous={report.isAnonymous}
            />

            <LegalModule severityLevel={report.severityLevel} isMinorVictim={isMinor} />

            {!isMinor && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  <p className="text-xs">
                    Délai d&apos;accusé de réception : 7 jours à compter du dépôt.
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}