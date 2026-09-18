"use client";

import { Archivo, Bebas_Neue } from "next/font/google";
import type { PosterVariantProps } from "../poster-types";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export function Y2kPoster({
  clubName,
  sport,
  primaryColor,
  trackingUrl,
  logoSrc,
  qrDataUrl,
}: PosterVariantProps) {
  const gloss = {
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 35%, transparent 60%)",
  };
  const popBg = {
    background: "linear-gradient(145deg, #f9a8d4 0%, #c084fc 45%, #22d3ee 130%)",
  };

  return (
    <div
      className="relative flex h-[1086px] w-[768px] flex-col overflow-hidden text-slate-900"
      style={{ ...popBg, fontFamily: archivo.style.fontFamily }}
    >
      {/* Motif étoiles/flou */}
      <div className="pointer-events-none absolute left-8 top-24 text-5xl opacity-60">✨</div>
      <div className="pointer-events-none absolute right-10 top-44 -rotate-12 text-4xl opacity-60">⭐</div>
      <div className="pointer-events-none absolute bottom-40 left-10 rotate-12 text-4xl opacity-60">💫</div>

      <div className="relative flex h-full flex-col px-12 pb-10 pt-7">
        {/* En-tête sticker */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-2xl border-[3px] border-slate-900 bg-white/80 px-4 py-2 shadow-[4px_4px_0_0_#0f172a] backdrop-blur" style={gloss}>
            {logoSrc ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 ring-2 ring-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoSrc}
                  alt={`Logo ${clubName}`}
                  className="max-h-full max-w-full object-contain"
                />
              </span>
            ) : (
              <span className="text-lg">🛡️</span>
            )}
            <div>
              <p className={`${bebas.className} text-xl leading-none tracking-[0.1em]`}>{clubName}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{sport}</p>
            </div>
          </div>
          <p className={`${bebas.className} rotate-3 rounded-lg border-[3px] border-slate-900 bg-white px-2.5 py-1 text-lg tracking-[0.15em] shadow-[3px_3px_0_0_#0f172a]`} style={{ color: primaryColor }}>
            CLUBSAFE
          </p>
        </div>

        {/* Titre pop */}
        <div className="mt-12 text-center">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-slate-800">
            Fais-toi entendre
          </p>
          <h1 className={`${bebas.className} mt-2 text-[92px] leading-[0.9] tracking-wide`}>
            <span className="inline-block -rotate-2 rounded-2xl border-[4px] border-slate-900 bg-white px-4 text-slate-900 shadow-[6px_6px_0_0_#0f172a]" style={gloss}>
              T&#39;AS VU
            </span>
            <br />
            <span
              className="mt-2 inline-block rotate-2 rounded-2xl border-[4px] border-slate-900 px-4 text-white shadow-[6px_6px_0_0_#0f172a]"
              style={{ backgroundColor: primaryColor }}
            >
              T&#39;ES PAS SEUL
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed font-medium text-slate-800">
            Violence, harcèlement, moqueries… <b>Écris directement à {clubName}</b> en{" "}
            <b>confidentiel ou 100 % anonyme</b> selon ton choix. Ton code secret, ton
            dossier, ton suivi.
          </p>
        </div>

        {/* QR sticker */}
        <div className="mt-8 flex items-center justify-center gap-8">
          <div className="-rotate-3 rounded-2xl border-[4px] border-slate-900 bg-white p-3 shadow-[6px_6px_0_0_#0f172a]" style={gloss}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR code de signalement" className="h-44 w-44" />
            <p className={`${bebas.className} mt-1 text-center text-lg tracking-[0.2em] text-slate-900`}>
              SCANNE-MOI
            </p>
          </div>
          <div className="space-y-2 text-sm font-bold text-slate-900">
            <p className="rounded-full border-[3px] border-slate-900 bg-white/85 px-4 py-1.5 shadow-[3px_3px_0_0_#0f172a] backdrop-blur">🔒 Anonymat possible</p>
            <p className="rotate-1 rounded-full border-[3px] border-slate-900 bg-yellow-300 px-4 py-1.5 shadow-[3px_3px_0_0_#0f172a]">📱 Tu écris au club, sans compte</p>
            <p className="-rotate-1 rounded-full border-[3px] border-slate-900 bg-white/85 px-4 py-1.5 shadow-[3px_3px_0_0_#0f172a] backdrop-blur">⏱️ Réponse en 7 jours</p>
          </div>
        </div>

        {/* Bas */}
        <div className="mt-auto">
          <div className="flex items-center justify-between rounded-2xl border-[3px] border-slate-900 bg-white px-5 py-3 shadow-[5px_5px_0_0_#0f172a]" style={gloss}>
            <p className={`${bebas.className} text-2xl tracking-wider`} style={{ color: primaryColor }}>
              PARLE AU CLUB
            </p>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              {clubName} · confidentiel
            </p>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-slate-700">
            Faits graves → le club transmet au <b>Procureur de la République</b> (Art. 40 CPP) et
            à <b>Signal-Sports</b> (0 800 05 95 95, gratuit) · aucune sanction pour un signalement
            de bonne foi · danger immédiat → <b>17</b>.{" "}
            {trackingUrl.replace(/^https?:\/\//, "")} · {clubName} ·{" "}
            {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())}
          </p>
        </div>
      </div>
    </div>
  );
}