import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  CircleDot,
  Send,
  CheckCircle2,
  Inbox,
  ArrowUpRight,
  Settings,
  Printer,
  LayoutGrid,
  LockKeyhole,
  MessageSquare,
  Zap,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clubLogoUrl } from "@/lib/club-logo";
import { REPORT_STATUSES, isSlaBreached, isSlaSoon } from "@/lib/constants";
import { AdminLogoutButton } from "./admin-logout";

export const metadata: Metadata = { title: "Tableau de bord — ClubSafe" };

const severityColor = (level: number) => {
  switch (level) {
    case 3:
      return {
        bar: "bg-gradient-to-r from-red-500 to-orange-400",
        pill: "bg-red-500/10 text-red-600 ring-red-200",
        glow: "shadow-red-500/20",
      };
    case 2:
      return {
        bar: "bg-gradient-to-r from-amber-500 to-yellow-400",
        pill: "bg-amber-500/10 text-amber-600 ring-amber-200",
        glow: "shadow-amber-500/20",
      };
    default:
      return {
        bar: "bg-gradient-to-r from-slate-500 to-slate-400",
        pill: "bg-slate-500/10 text-slate-600 ring-slate-200",
        glow: "shadow-slate-500/20",
      };
  }
};

const statusMeta = (status: string) => {
  switch (status) {
    case "NOUVEAU":
      return {
        icon: Inbox,
        label: REPORT_STATUSES.NOUVEAU,
        cls: "bg-red-50 text-red-700 ring-red-200",
        dot: "bg-red-500",
      };
    case "EN_COURS":
      return {
        icon: CircleDot,
        label: REPORT_STATUSES.EN_COURS,
        cls: "bg-amber-50 text-amber-700 ring-amber-200",
        dot: "bg-amber-500",
      };
    case "TRANSMIS_AUTORITES":
      return {
        icon: Send,
        label: REPORT_STATUSES.TRANSMIS_AUTORITES,
        cls: "bg-blue-50 text-blue-700 ring-blue-200",
        dot: "bg-blue-500",
      };
    default:
      return {
        icon: CheckCircle2,
        label: REPORT_STATUSES.RESOLU,
        cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        dot: "bg-emerald-500",
      };
  }
};

function formatDate(date: Date): string {
  const today = new Date();
  const diff = Math.floor((today.getTime() - date.getTime()) / (24 * 3600 * 1000));
  if (diff === 0) {
    return `aujourd'hui à ${new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)}`;
  }
  if (diff === 1) return "hier";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: diff > 365 ? "numeric" : undefined,
  }).format(date);
}

function daysLeft(createdAt: Date): number {
  const deadline = createdAt.getTime() + 7 * 24 * 3600 * 1000;
  return Math.max(0, Math.ceil((deadline - Date.now()) / (24 * 3600 * 1000)));
}

export default async function DashboardPage() {
  const admin = await requireAdmin();

  const reports = await prisma.report.findMany({
    where: { clubId: admin.clubId },
    orderBy: { createdAt: "desc" },
    include: { messages: true },
  });

  const categories = await prisma.clubCategory.findMany({
    where: { clubId: admin.clubId },
  });
  const catMap = new Map(categories.map((c) => [c.key, c.label]));

  const total = reports.length;
  const nouveaux = reports.filter((r) => r.status === "NOUVEAU").length;
  const slaBreached = reports.filter(
    (r) => r.status === "NOUVEAU" && isSlaBreached(r.createdAt),
  ).length;
  const slaSoon = reports.filter(
    (r) => r.status === "NOUVEAU" && !isSlaBreached(r.createdAt) && isSlaSoon(r.createdAt),
  ).length;
  const resolus = reports.filter((r) => r.status === "RESOLU").length;
  const grave = reports.filter((r) => r.severityLevel === 3).length;
  const messages = reports.reduce((acc, r) => acc + r.messages.length, 0);

  const kpis = [
    {
      label: "Signalements",
      value: total,
      sub: `${grave} grave${grave > 1 ? "s" : ""} · ${messages} message${messages > 1 ? "s" : ""}`,
      icon: Zap,
      accent: "from-blue-500 to-indigo-500",
      iconBg: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "À traiter",
      value: nouveaux,
      sub: nouveaux > 0 ? "en attente d'accusé" : "aucun en attente",
      icon: Inbox,
      accent: "from-red-500 to-rose-500",
      iconBg: "bg-red-500/10 text-red-600",
    },
    {
      label: "Urgences SLA",
      value: slaBreached + slaSoon,
      sub:
        slaBreached > 0
          ? `${slaBreached} dépassé${slaBreached > 1 ? "s" : ""} · ${slaSoon} sous 48 h`
          : slaSoon > 0
            ? `${slaSoon} sous 48 h`
            : "tout est dans les temps",
      icon: Clock,
      accent: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Clôturés",
      value: resolus,
      sub: total > 0 ? `${Math.round((resolus / total) * 100)}% du volume` : "aucun dossier clos",
      icon: CheckCircle2,
      accent: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* ===== HEADER ===== */}
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(50rem 30rem at 85% -20%, rgba(59,130,246,0.35), transparent 60%), radial-gradient(30rem 20rem at 0% 120%, rgba(37,99,235,0.2), transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {admin.club.logoFileName ? (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 ring-1 ring-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={clubLogoUrl(admin.club.slug)}
                    alt={`Logo ${admin.club.name}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </span>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-900/40">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold tracking-tight">{admin.club.name}</h1>
                <p className="text-xs text-slate-400">
                  Bureau du club · {admin.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {admin.role === "SUPER_ADMIN" && (
                <Link
                  href="/admin/plateforme"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 backdrop-blur transition hover:bg-white/10"
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Plateforme
                </Link>
              )}
              <Link
                href="/admin/affiche"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 backdrop-blur transition hover:bg-white/10"
              >
                <Printer className="h-3.5 w-3.5" /> Affiche
              </Link>
              <Link
                href="/admin/parametres"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 backdrop-blur transition hover:bg-white/10"
              >
                <Settings className="h-3.5 w-3.5" /> Paramètres
              </Link>
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* ===== KPI CARDS ===== */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${k.iconBg}`}
                >
                  <k.icon className="h-5 w-5" />
                </span>
                <span
                  className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${k.accent} opacity-70`}
                />
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                {k.value}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-700">{k.label}</p>
              <p className="mt-1 truncate text-xs text-slate-400">{k.sub}</p>
            </div>
          ))}
        </section>

        {/* ===== ALERTE SLA GLOBALE ===== */}
        {slaBreached > 0 && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-5 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/30">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-red-900">
                {slaBreached} dossier{slaBreached > 1 ? "s" : ""} au-delà du délai de 7 jours
              </p>
              <p className="text-xs text-red-700/80">
                Un accusé de réception doit être envoyé sans délai pour respecter l&apos;engagement.
              </p>
            </div>
          </div>
        )}

        {/* ===== DOSSIERS ===== */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Dossiers de signalement</h2>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
              {total} signalement{total > 1 ? "s" : ""}
            </span>
          </div>

          {total === 0 ? (
            <div className="mt-5 flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <Inbox className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-900">Aucun signalement</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Aucun dossier n&apos;a encore été créé. Partagez votre affiche vestiaire pour que
                les adhérents connaissent ce canal.
              </p>
              <Link
                href="/admin/affiche"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
              >
                <Printer className="h-4 w-4" /> Voir mon affiche
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {reports.map((r) => {
                const sev = severityColor(r.severityLevel);
                const st = statusMeta(r.status);
                const slaLeft = r.status === "NOUVEAU" ? daysLeft(r.createdAt) : null;
                return (
                  <li key={r.id}>
                    <Link
                      href={`/admin/report/${r.id}`}
                      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 sm:flex-row sm:items-center sm:gap-5"
                    >
                      {/* Barre de sévérité */}
                      <span
                        className={`absolute left-0 top-0 h-full w-1 ${sev.bar} opacity-80`}
                      />

                      <div className="min-w-0 flex-1 pl-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${st.cls}`}
                          >
                            <st.icon className="h-3.5 w-3.5" />
                            {st.label}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${sev.pill}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${sev.bar}`} />
                            Niveau {r.severityLevel}
                          </span>
                          {r.isMinorVictim && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
                              <ShieldCheck className="h-3.5 w-3.5" /> Mineur
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {catMap.get(r.categoryKey) ?? r.categoryKey}
                          </span>
                          {slaLeft !== null && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                              <Clock className="h-3.5 w-3.5" />
                              {isSlaBreached(r.createdAt)
                                ? "SLA dépassé"
                                : `J-${slaLeft} SLA`}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-700">
                          {r.description}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-4 pl-2 sm:pl-0">
                        <div className="hidden text-right sm:block">
                          <p className="text-xs font-semibold text-slate-500">
                            {formatDate(r.createdAt)}
                          </p>
                          <div className="mt-1 flex items-center justify-end gap-3 text-xs text-slate-400">
                            {r.isAnonymous && (
                              <span className="inline-flex items-center gap-1">
                                <LockKeyhole className="h-3.5 w-3.5" /> Anonyme
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare className="h-3.5 w-3.5" /> {r.messages.length}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition group-hover:bg-blue-600 group-hover:text-white ${sev.glow}`}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}