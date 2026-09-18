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
  ExternalLink,
  Settings,
  Printer,
  LayoutGrid,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clubLogoUrl } from "@/lib/club-logo";
import { REPORT_STATUSES, isSlaBreached, isSlaSoon } from "@/lib/constants";
import { AdminLogoutButton } from "./admin-logout";

export const metadata: Metadata = { title: "Tableau de bord — ClubSafe" };

const statusBadge = (status: string, createdAt: Date) => {
  const icon =
    status === "NOUVEAU" ? (
      <Inbox className="h-3.5 w-3.5" />
    ) : status === "EN_COURS" ? (
      <CircleDot className="h-3.5 w-3.5" />
    ) : status === "TRANSMIS_AUTORITES" ? (
      <Send className="h-3.5 w-3.5" />
    ) : (
      <CheckCircle2 className="h-3.5 w-3.5" />
    );
  const colors =
    status === "NOUVEAU"
      ? "bg-red-100 text-red-700 border-red-200"
      : status === "EN_COURS"
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : status === "TRANSMIS_AUTORITES"
          ? "bg-blue-100 text-blue-700 border-blue-200"
          : "bg-emerald-100 text-emerald-700 border-emerald-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${colors}`}
    >
      {icon} {REPORT_STATUSES[status as keyof typeof REPORT_STATUSES] ?? status}
    </span>
  );
};

const severityBadge = (level: number) => {
  const colors =
    level === 3
      ? "bg-red-600 text-white"
      : level === 2
        ? "bg-amber-500 text-white"
        : "bg-slate-500 text-white";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${colors}`}>
      Niv. {level}
    </span>
  );
};

const slaTag = (createdAt: Date, status: string) => {
  if (status !== "NOUVEAU") return null;
  if (isSlaBreached(createdAt))
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
        <AlertTriangle className="h-3 w-3" /> SLA dépassé
      </span>
    );
  if (isSlaSoon(createdAt))
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
        <Clock className="h-3 w-3" /> SLA bientôt dépassé
      </span>
    );
  return null;
};

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

  return (
    <main className="min-h-screen bg-slate-100 pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {admin.club.logoFileName ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clubLogoUrl(admin.club.slug)}
                  alt={`Logo ${admin.club.name}`}
                  className="max-h-full max-w-full object-contain"
                />
              </span>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
            )}
            <div>
              <h1 className="text-sm font-bold text-slate-900">ClubSafe — {admin.club.name}</h1>
              <p className="text-xs text-slate-500">Bureau du club · {admin.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {admin.role === "SUPER_ADMIN" && (
              <Link
                href="/admin/plateforme"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Plateforme
              </Link>
            )}
            <Link
              href="/admin/affiche"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5" /> Affiche
            </Link>
            <Link
              href="/admin/parametres"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <Settings className="h-3.5 w-3.5" /> Paramètres
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Dossiers de signalement</h2>
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
            {reports.length} signalement{reports.length > 1 ? "s" : ""}
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Inbox className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">Aucun signalement</h3>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
              Aucun dossier n&apos;a encore été créé. Partagez votre affiche vestiaire pour que les adhérents connaissent ce canal.
            </p>
            <Link
              href="/admin/affiche"
              className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Voir mon affiche
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {reports.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/report/${r.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {statusBadge(r.status, r.createdAt)}
                      {severityBadge(r.severityLevel)}
                      {slaTag(r.createdAt, r.status)}
                      {r.isMinorVictim && (
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
                          Mineur
                        </span>
                      )}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                        {catMap.get(r.categoryKey) ?? r.categoryKey}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-700">{r.description}</p>
                    <p className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
                      <span>
                        Reçu le{" "}
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(r.createdAt)}
                      </span>
                      {r.isAnonymous && <span>🔒 Anonyme</span>}
                      <span>{r.messages.length} message{r.messages.length > 1 ? "s" : ""}</span>
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-slate-300" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}