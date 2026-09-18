import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, LockKeyhole, Inbox, AlertTriangle, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { normalizeTrackingToken } from "@/lib/tokens";
import { clubLogoUrl } from "@/lib/club-logo";
import { formatters } from "./helpers";
import { MessageThread } from "./message-thread";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  return { title: "Suivi de mon signalement" };
}

export default async function SuiviPage({ params }: Props) {
  const { token } = await params;
  const normalized = normalizeTrackingToken(token);

  const report = await prisma.report.findUnique({
    where: { trackingToken: normalized },
    include: {
      club: true,
      messages: { orderBy: { createdAt: "asc" } },
      attachments: true,
      auditLogs: { orderBy: { timestamp: "asc" } },
    },
  });

  if (!report) {
    notFound();
  }

  const categories = await prisma.clubCategory.findMany({
    where: { clubId: report.clubId, key: report.categoryKey },
  });
  const category = categories[0] ?? null;

  const timeline = formatters.timelineFor(report.status);
  const activeIndex = formatters.statusIndex(report.status);
  const slaDeadline = new Date(report.createdAt.getTime() + 7 * 24 * 3600 * 1000);

  return (
    <main className="min-h-screen bg-slate-100 pb-16">
      <header
        className="shade-club text-white"
        style={{ "--club-primary": report.club.primaryColor } as React.CSSProperties}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
          <div className="flex items-center gap-2.5">
            {report.club.logoFileName ? (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clubLogoUrl(report.club.slug)}
                  alt={`Logo ${report.club.name}`}
                  className="max-h-full max-w-full object-contain"
                />
              </span>
            ) : (
              <ShieldCheck className="h-6 w-6" />
            )}
            <div>
              <p className="text-sm font-semibold">{report.club.name}</p>
              <p className="text-xs text-white/80">Espace de suivi sécurisé</p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur transition hover:bg-white/20"
          >
            Accueil
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-6">
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <LockKeyhole className="h-5 w-5 shrink-0" />
          <p>
            Accès déverrouillé par votre code <b className="font-mono">{report.trackingToken}</b>.
            Vos échanges avec le club restent anonymes.
          </p>
        </div>

        {/* Frise chronologique */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Suivi de votre dossier
          </h2>
          <ol className="mt-4 grid grid-cols-4 gap-1">
            {timeline.map((label, i) => {
              const done = i < activeIndex;
              const current = i === activeIndex;
              return (
                <li key={label} className="flex flex-col items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      done
                        ? "bg-emerald-500 text-white"
                        : current
                          ? "bg-club text-white"
                          : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`text-center text-[11px] leading-tight ${
                      current ? "font-bold text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Statut actuel : <b>{timeline[activeIndex]}</b>
            {report.status === "RESOLU"
              ? " — votre dossier est clôturé. Merci de votre confiance."
              : report.status === "TRANSMIS_AUTORITES"
                ? " — le club a pris des mesures et l'a transmis aux autorités compétentes."
                : report.status === "EN_COURS"
                  ? " — le bureau instruit actuellement votre signalement."
                  : " — votre signalement est en cours de prise en compte."}
          </p>
          {report.status === "NOUVEAU" && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <p>
                Le club doit accuser réception avant le{" "}
                <b>
                  {new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(slaDeadline)}
                </b>
                .
              </p>
            </div>
          )}
        </section>

        {/* Détails récapitulatifs */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Récapitulatif de votre signalement
          </h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3">
              <dt className="text-xs font-medium text-slate-500">Nature des faits</dt>
              <dd className="mt-0.5 font-semibold text-slate-900">
                {category ? category.label : report.categoryKey}
              </dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <dt className="text-xs font-medium text-slate-500">Déclaré en tant que</dt>
              <dd className="mt-0.5 font-semibold text-slate-900">{report.reporterRole}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <dt className="text-xs font-medium text-slate-500">Victime mineure</dt>
              <dd className="mt-0.5 font-semibold text-slate-900">
                {report.isMinorVictim ? "Oui — procédure prioritaire" : "Non renseigné"}
              </dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <dt className="text-xs font-medium text-slate-500">Hébergement du dossier</dt>
              <dd className="mt-0.5 font-semibold text-slate-900">
                {report.isAnonymous ? "Anonyme" : "Identité connue du président"}
              </dd>
            </div>
          </dl>
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">
            {report.description}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Signalement reçu le {formatters.dateTime(report.createdAt)}
            {report.locationDetail ? ` — Lieu : ${report.locationDetail}` : ""}
            {report.incidentDate
              ? ` — Date des faits : ${new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(report.incidentDate)}`
              : ""}
          </p>
        </section>

        {/* Pièces jointes */}
        {report.attachments.length > 0 && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Pièces jointes transmises
            </h2>
            <ul className="mt-3 space-y-2">
              {report.attachments.map((a) => (
                <li key={a.id}>
                  <a
                    href={`/api/files/${a.id}?token=${encodeURIComponent(report.trackingToken)}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm transition hover:bg-slate-50"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="min-w-0 flex-1 truncate text-slate-700">
                      {a.originalName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {(a.size / 1024).toFixed(0)} Ko
                    </span>
                    <span className="text-xs font-semibold text-club">Télécharger</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Messagerie */}
        <MessageThread
          reportId={report.id}
          trackingToken={report.trackingToken}
          clubName={report.club.name}
          primaryColor={report.club.primaryColor}
          messages={report.messages.map((m) => ({
            id: m.id,
            senderType: m.senderType,
            content: m.content,
            createdAt: m.createdAt.toISOString(),
          }))}
        />
      </div>

      {/* Accès admin discret */}
      <div className="no-print text-center text-xs text-slate-400">
        <Inbox className="mr-1 inline h-3 w-3" />
        <Link href="/admin/login" className="hover:underline">
          Accès bureau du club
        </Link>
      </div>
    </main>
  );
}