import Link from "next/link";
import { ArrowLeft, ShieldCheck, Printer, Settings, LayoutGrid } from "lucide-react";
import { AdminLogoutButton } from "@/app/admin/dashboard/admin-logout";

type Props = {
  backHref?: string;
  backLabel?: string;
  logoSrc?: string | null;
  isSuperAdmin?: boolean;
};

export function AdminNav({ backHref, backLabel, logoSrc, isSuperAdmin }: Props) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-4">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel ?? "Retour"}
            </Link>
          )}
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            {logoSrc ? (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoSrc}
                  alt="Logo du club"
                  className="max-h-full max-w-full object-contain"
                />
              </span>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
            )}
            <span className="text-sm font-bold text-slate-900">Espace bureau du club</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {isSuperAdmin && (
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
  );
}