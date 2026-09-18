import {
  ShieldAlert,
  Phone,
  FileText,
  Download,
  ClipboardList,
  Scale,
} from "lucide-react";
import { getLegalGuidance } from "@/lib/legal";
import { LEGAL_REFERENCES } from "@/lib/constants";

export function LegalModule({
  severityLevel,
  isMinorVictim,
}: {
  severityLevel: number;
  isMinorVictim: boolean;
}) {
  const guidance = getLegalGuidance(severityLevel, isMinorVictim);

  return (
    <section
      className={`rounded-2xl border-2 p-5 shadow-sm ${
        guidance.level === 3
          ? "border-red-300 bg-red-50"
          : guidance.level === 2
            ? "border-amber-300 bg-amber-50"
            : "border-blue-200 bg-blue-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${
            guidance.level === 3 ? "bg-red-600" : guidance.level === 2 ? "bg-amber-500" : "bg-blue-600"
          }`}
        >
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
            Assistant légale contextuel
          </h2>
          <p
            className={`mt-0.5 text-xs font-bold ${
              guidance.level === 3 ? "text-red-700" : guidance.level === 2 ? "text-amber-700" : "text-blue-700"
            }`}
          >
            {guidance.label}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-700">{guidance.message}</p>

      <ul className="mt-3 space-y-1.5">
        {guidance.actions.map((a) => (
          <li key={a} className="flex items-start gap-2 text-sm text-slate-700">
            <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            {a}
          </li>
        ))}
      </ul>

      {guidance.level === 3 && (
        <div className="mt-4 rounded-xl border border-red-200 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-red-700">
            <Phone className="h-4 w-4" /> Cellule Signal-Sports
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {LEGAL_REFERENCES.signalSports.label} :{" "}
            <b className="font-mono">{LEGAL_REFERENCES.signalSports.phone}</b> (appel
            gratuit) — {LEGAL_REFERENCES.signalSports.note}
          </p>
          <a
            href={LEGAL_REFERENCES.signalSports.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
          >
            <Scale className="h-3.5 w-3.5" /> Accéder au portail Signal-Sports
          </a>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {guidance.level === 3 && (
          // Téléchargement direct (Content-Disposition: attachment) : <a> requis, pas <Link>
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a
            href="/api/admin/templates/saisine-procureur"
            className="flex w-full items-center justify-between gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Modèle de saisine du Procureur
            </span>
            <Download className="h-4 w-4" />
          </a>
        )}
        {guidance.level === 2 && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a
            href="/api/admin/templates/mesure-conservatoire"
            className="flex w-full items-center justify-between gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Modèle de mesure conservatoire
            </span>
            <Download className="h-4 w-4" />
          </a>
        )}
        {guidance.level === 1 && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a
            href="/api/admin/templates/fiche-entretien"
            className="flex w-full items-center justify-between gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Fiche d&apos;entretien de médiation
            </span>
            <Download className="h-4 w-4" />
          </a>
        )}
      </div>

      {guidance.level === 3 && (
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          Rappel : le fait pour une personne d&apos;avoir connaissance d&apos;un délit et de ne pas le
          signaler peut engager la responsabilité du club (Art. 434-1 du Code pénal ; Art. 40
          al. 2 du CPP pour les faits constatés dans l&apos;exercice de ses fonctions).
        </p>
      )}
    </section>
  );
}