"use client";

import { useEffect, useState, useActionState } from "react";
import QRCode from "qrcode";
import { Printer, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { POSTER_STYLES, type PosterStyleId, type PosterVariantProps } from "./poster-types";
import { SportPoster } from "./variants/sport";
import { ClassicPoster } from "./variants/classic";
import { JeunePoster } from "./variants/jeune";
import { MinimalPoster } from "./variants/minimal";
import { StreetPoster } from "./variants/street";
import { NeonPoster } from "./variants/neon";
import { Y2kPoster } from "./variants/y2k";
import { EditoPoster } from "./variants/edito";
import { savePosterStyleAction, type StyleState } from "./actions";

type Props = {
  clubName: string;
  sport: string;
  primaryColor: string;
  trackingUrl: string;
  logoSrc: string | null;
  initialStyle: string;
};

const VARIANTS: Record<PosterStyleId, (p: PosterVariantProps) => React.JSX.Element> = {
  SPORT: SportPoster,
  CLASSIC: ClassicPoster,
  JEUNE: JeunePoster,
  MINIMAL: MinimalPoster,
  STREET: StreetPoster,
  NEON: NeonPoster,
  Y2K: Y2kPoster,
  EDITO: EditoPoster,
};

export function PosterManager({
  clubName,
  sport,
  primaryColor,
  trackingUrl,
  logoSrc,
  initialStyle,
}: Props) {
  const [selected, setSelected] = useState<PosterStyleId>(
    POSTER_STYLES.some((s) => s.id === initialStyle)
      ? (initialStyle as PosterStyleId)
      : "SPORT",
  );
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(savePosterStyleAction, {} as StyleState);

  useEffect(() => {
    QRCode.toDataURL(trackingUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 720,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch((e) => console.error("Erreur QR:", e));
  }, [trackingUrl]);

  const baseProps = { clubName, sport, primaryColor, trackingUrl, logoSrc };
  const selectedMeta = POSTER_STYLES.find((s) => s.id === selected);

  return (
    <div>
      {/* Barre d'outils */}
      <div className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <p className="text-sm font-semibold text-slate-700">
            Affiche vestiaire A4 — choix du style
          </p>
          <button
            onClick={() => window.print()}
            style={{ backgroundColor: primaryColor }}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90"
          >
            <Printer className="h-4 w-4" /> Imprimer / Exporter PDF
          </button>
        </div>
      </div>

      {/* Sélecteur de style */}
      <div className="no-print mx-auto max-w-5xl px-5 pt-8">
        <h2 className="text-base font-bold text-slate-900">Choisissez le style de votre affiche</h2>
        <p className="mt-1 text-sm text-slate-500">
          Sélectionnez un style, puis imprimez ou exportez. Votre choix est mémorisé pour ce club.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {POSTER_STYLES.map((style) => {
            const active = selected === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelected(style.id)}
                aria-pressed={active}
                className={`group rounded-2xl border-2 p-3 text-left transition ${
                  active
                    ? "border-blue-600 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-20 w-full items-center justify-center rounded-xl bg-gradient-to-br ${style.swatch} text-3xl ${
                    active ? "" : "opacity-80 group-hover:opacity-100"
                  }`}
                >
                  <span className="drop-shadow">{style.emoji}</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{style.label}</p>
                    <p className="text-[11px] leading-tight text-slate-500">{style.tagline}</p>
                  </div>
                  {active && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* État de sauvegarde */}
        <div className="mt-4 flex items-center gap-3">
          <form action={formAction}>
            <input type="hidden" name="posterStyle" value={selected} />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
            >
              {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Mémoriser ce style
            </button>
            {state.ok ? (
              <span className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Style enregistré
              </span>
            ) : null}
            {state.error ? (
              <span className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
                <AlertTriangle className="h-3.5 w-3.5" /> {state.error}
              </span>
            ) : null}
          </form>
        </div>
      </div>

      {/* Grand aperçu imprimable de la variante choisie */}
      <div className="mx-auto max-w-5xl px-5 pt-8 pb-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Aperçu — {selectedMeta?.label}
        </p>
        <div className="overflow-x-auto">
          <div className="print-page mx-auto w-fit overflow-hidden rounded-2xl bg-white shadow-xl">
            {qrDataUrl ? (
              <div style={{ width: 768 }}>
                {(() => {
                  const Component = VARIANTS[selected];
                  return <Component {...baseProps} qrDataUrl={qrDataUrl} />;
                })()}
              </div>
            ) : (
              <div className="flex h-[1086px] w-[768px] items-center justify-center">
                <p className="animate-pulse text-sm text-slate-400">Génération de l&apos;affiche…</p>
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">
          L&apos;aperçu est à l&apos;échelle de la feuille A4 (contenu large de 768 px). L&apos;impression
          remplit toute la page A4, sans marges.
        </p>
      </div>
    </div>
  );
}