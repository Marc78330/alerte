"use client";

import { Archivo, Bebas_Neue } from "next/font/google";
import type { PosterVariantProps } from "../poster-types";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export function StreetPoster({
  clubName,
  sport,
  primaryColor,
  trackingUrl,
  logoSrc,
  qrDataUrl,
}: PosterVariantProps) {
  const halftone = {
    backgroundImage: `radial-gradient(${primaryColor} 1.5px, transparent 1.5px)`,
    backgroundSize: "14px 14px",
  };

  return (
    <div
      className="relative h-[1086px] w-[768px] overflow-hidden bg-[#f4f4f0] text-slate-900"
      style={{ fontFamily: archivo.style.fontFamily }}
    >
      {/* Bande jaune interdit */}
      <div
        className="absolute left-0 top-0 z-10 flex h-9 w-[150%] -rotate-6 items-center gap-3 bg-yellow-400 pl-6"
        style={{ transformOrigin: "left top" }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className={`${bebas.className} whitespace-nowrap text-sm tracking-[0.2em] text-slate-900`}
          >
            ATTENTION • OSE EN PARLER •
          </span>
        ))}
      </div>

      {/* Fond moucheté */}
      <div
        className="absolute inset-0 opacity-25"
        style={{ ...halftone, maskImage: "radial-gradient(circle at 50% 40%, black, transparent 75%)" }}
      />

      {/* Tag arrière-plan */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p
          className={`${bebas.className} -rotate-6 text-[240px] leading-none opacity-[0.08]`}
          style={{ color: primaryColor }}
        >
          PARLE !
        </p>
      </div>

      <div className="relative flex h-full flex-col px-12 pb-10 pt-24">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 text-white">
            {logoSrc ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5">
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
            <div className={`${bebas.className} text-xl leading-none tracking-[0.12em]`}>
              <p>{clubName}</p>
              <p className="text-sm text-white/70">{sport}</p>
            </div>
          </div>
          <p className={`${bebas.className} rotate-3 rounded-md bg-slate-900 px-3 py-1.5 text-base tracking-[0.2em] text-yellow-400`}>
            {clubName}
          </p>
        </div>

        {/* Titre graff */}
        <div className="mt-9">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-500">
            On a tous un mot à dire
          </p>
          <h1 className={`${bebas.className} mt-2 text-[88px] leading-[0.9] tracking-wide text-slate-900`}>
            Victime ou
            <br />
            témoin ?
            <br />
            <span
              className="inline-block -rotate-2 px-3 pb-1 text-white"
              style={{ backgroundColor: primaryColor }}
            >
              PARLE.
            </span>
          </h1>
          <div className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-700">
            <b>Personne ne doit subir</b> violence, harcèlement ou discrimination dans le
            sport. Écris direct à <b>{clubName}</b> via ce canal — <b>100 % confidentiel</b>,
            anonyme si tu le veux.
          </div>
        </div>

        {/* QR block */}
        <div className="mt-8 flex items-center gap-7">
          <div className="-rotate-2 border-4 border-slate-900 bg-white p-3 shadow-[8px_8px_0_0_#0f172a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR code de signalement" className="h-44 w-44" />
          </div>
          <div className="space-y-2.5 text-sm font-bold text-slate-800">
            <p className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                1
              </span>
              Scanne le QR code
            </p>
            <p className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                2
              </span>
              Raconte ce que tu as vécu au club
            </p>
            <p className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                3
              </span>
              Suis ton dossier en secret
            </p>
          </div>
        </div>

        {/* Bas */}
        <div className="mt-auto">
          <div className="flex items-center gap-4">
            <p
              className={`${bebas.className} rounded-lg px-4 py-2 text-2xl tracking-wider text-white`}
              style={{ backgroundColor: primaryColor }}
            >
              PARLE AU CLUB
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              {clubName} · 100 % confidentiel
            </p>
          </div>

          <div className="mt-4 border-t-4 border-slate-900 pt-3 text-[11px] leading-relaxed text-slate-500">
            <p>
              Faits graves → le club transmet au <b>Procureur de la République</b> (Art. 40
              CPP) et à <b>Signal-Sports</b> (0 800 05 95 95, gratuit). Aucune sanction
              contre un signalement de bonne foi. Danger immédiat → <b>17</b>.
            </p>
            <p className="mt-1.5 font-semibold text-slate-700">
              {trackingUrl.replace(/^https?:\/\//, "")} · {clubName} ·{" "}
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}