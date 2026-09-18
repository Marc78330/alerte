"use client";

import { Bebas_Neue, Archivo } from "next/font/google";
import type { PosterVariantProps } from "../poster-types";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export function JeunePoster({
  clubName,
  sport,
  primaryColor,
  trackingUrl,
  logoSrc,
  qrDataUrl,
}: PosterVariantProps) {
  const pills = [
    { emoji: "🔒", label: "Anonymat possible" },
    { emoji: "📱", label: "Suivi sans compte" },
    { emoji: "⏱️", label: "Réponse en 7 jours" },
  ];

  return (
    <div
      className="h-[1086px] w-[768px] overflow-hidden bg-white text-slate-900"
      style={{ fontFamily: archivo.style.fontFamily }}
    >
      {/* Haut fun */}
      <div
        className="relative px-10 pb-8 pt-7 text-white"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, #f472b6 55%, #fb923c 130%)`,
        }}
      >
        <span
          className="pointer-events-none absolute -right-6 -top-8 h-44 w-44 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoSrc ? (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoSrc}
                  alt={`Logo ${clubName}`}
                  className="max-h-full max-w-full object-contain"
                />
              </span>
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/25 text-xl">
                🛡️
              </span>
            )}
            <p className={`${bebas.className} text-2xl tracking-[0.14em]`}>
              {clubName} · {sport}
            </p>
          </div>
          <p className={`${bebas.className} text-lg tracking-[0.24em] text-white/85`}>ClubSafe</p>
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.22em] text-white/85">
          T&apos;as vécu ou vu quelque chose au club ?
        </p>
        <h1 className={`${bebas.className} mt-1 text-6xl leading-[0.95] tracking-wide`}>
          ON EST LÀ
          <br />
          POUR TOI.
        </h1>
        <p className="mt-3 max-w-[36rem] text-sm leading-relaxed text-white/90">
          Violence, harcèlement, moquerie, discrimination… T&apos;es pas tout·e seul·e. Écris
          direct à <b>l&apos;équipe de {clubName}</b> : on te lit, anonymement si tu veux. Ton
          code secret reste à toi.
        </p>
      </div>

      {/* Corps */}
      <div className="px-10 py-7">
        <div className="grid grid-cols-[1fr_auto] items-center gap-8">
          <div>
            <div className="flex flex-wrap gap-3">
              {pills.map((p) => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-bold text-slate-800"
                  style={{ borderColor: primaryColor }}
                >
                  <span className="text-base">{p.emoji}</span> {p.label}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className={`${bebas.className} text-xl tracking-[0.12em]`} style={{ color: primaryColor }}>
                COMMENT ÇA MARCHE ?
              </p>
              <ol className="mt-3 space-y-2 text-sm font-medium text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-black text-white" style={{ backgroundColor: primaryColor }}>
                    1
                  </span>
                  Scanne le QR code avec ton téléphone
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-black text-white" style={{ backgroundColor: primaryColor }}>
                    2
                  </span>
                  Raconte ce que tu as vu ou vécu (3 questions max)
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-black text-white" style={{ backgroundColor: primaryColor }}>
                    3
                  </span>
                  L&apos;équipe du club te lit et te répond sous 7 jours
                </li>
              </ol>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-white">
              <span className={`${bebas.className} text-2xl tracking-wider`}>Parle au club</span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                {clubName} · 100 % confidentiel
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className="rounded-[28px] p-3 shadow-xl"
              style={{ background: `linear-gradient(160deg, ${primaryColor}, #ec4899 90%)` }}
            >
              <div className="rounded-[20px] bg-white p-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR code de signalement" className="h-48 w-48" />
              </div>
            </div>
            <p
              className="mt-3 max-w-[13rem] text-center text-sm font-black uppercase tracking-wide"
              style={{ color: primaryColor }}
            >
              Scanne-moi direct
            </p>
          </div>
        </div>

        {/* Mentions */}
        <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-300 p-4 text-[12px] leading-relaxed text-slate-500">
          <p>
            <b className="text-slate-700">Infos utiles :</b> les faits graves sont transmis au{" "}
            <b>Procureur de la République</b> (Art. 40 CPP) et à <b>Signal-Sports</b> (0 800 05 95 95).
            Aucune sanction contre un signalement de bonne foi. En <b>danger immédiat</b>, appelle le{" "}
            <b>17</b>.
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>{trackingUrl.replace(/^https?:\/\//, "")} · {clubName} · {sport}</span>
          <span>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())}</span>
        </div>
      </div>
    </div>
  );
}