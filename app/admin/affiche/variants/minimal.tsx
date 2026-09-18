"use client";

import { Bebas_Neue, Archivo } from "next/font/google";
import type { PosterVariantProps } from "../poster-types";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export function MinimalPoster({
  clubName,
  sport,
  primaryColor,
  trackingUrl,
  logoSrc,
  qrDataUrl,
}: PosterVariantProps) {
  return (
    <div
      className="flex h-[1086px] w-[768px] flex-col bg-white text-slate-900"
      style={{ fontFamily: archivo.style.fontFamily }}
    >
      {/* Espace haut */}
      <div className="flex items-center justify-between px-12 pt-9">
        <div className="flex items-center gap-2.5">
          {logoSrc ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-50 ring-1 ring-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt={`Logo ${clubName}`}
                className="max-h-full max-w-full object-contain"
              />
            </span>
          ) : null}
          <p className="text-sm font-semibold tracking-wide text-slate-700">{clubName}</p>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">ClubSafe</p>
      </div>

      {/* Message central */}
      <div className="flex flex-1 flex-col justify-center px-12">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">
          Violence · Harcèlement · Discrimination
        </p>
        <h1 className={`${bebas.className} mt-4 text-[72px] leading-[0.95] tracking-wide text-slate-900`}>
          Parler,
          <br />
          c&apos;est
          <br />
          <span
            className="inline-block -rotate-1 border-b-8 px-1"
            style={{ color: primaryColor, borderColor: primaryColor }}
          >
            un droit.
          </span>
        </h1>

        <div className="mt-8 h-px w-24" style={{ backgroundColor: primaryColor }} />
        <p className="mt-6 max-w-[30rem] text-[15px] leading-relaxed text-slate-600">
          {clubName} met à votre disposition un canal de signalement confidentiel et
          anonyme : victime ou témoin, écrivez directement au club, de façon simple,
          discrète et sans jugement.
        </p>

        <div className="mt-8 flex items-center gap-8">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR code de signalement" className="h-36 w-36 rounded-2xl border-2" style={{ borderColor: primaryColor }} />
            <div>
              <p className="text-sm font-bold text-slate-800">Écrire au club</p>
              <p className="text-xs text-slate-500">Scannez, 3 questions max</p>
              <p className="mt-1 text-[11px] font-semibold" style={{ color: primaryColor }}>
                {trackingUrl.replace(/^https?:\/\//, "")}
              </p>
            </div>
          </div>
          <div className="space-y-1.5 text-sm text-slate-600">
            <p>🔒 Anonymat possible en toutes circonstances</p>
            <p>📱 Réponse et suivi sous 7 jours</p>
            <p>🌱 Sans jugement, sans conséquence</p>
          </div>
        </div>
      </div>

      {/* Mentions */}
      <div className="px-12 pb-9">
        <div className="border-t border-slate-200 pt-4 text-[11px] leading-relaxed text-slate-400">
          <p>
            {clubName} · {sport} — Les faits graves sont transmis au Procureur de la République
            (Art. 40 CPP) et à Signal-Sports : 0 800 05 95 95 (gratuit). En danger immédiat,
            appelez le 17. Aucune sanction en cas de signalement de bonne foi.
          </p>
          <p className="mt-1.5">
            Document de prévention diffusé dans les lieux d&apos;activité —{" "}
            {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())}
          </p>
        </div>
      </div>
    </div>
  );
}