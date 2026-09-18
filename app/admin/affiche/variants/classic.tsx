"use client";

import { Bebas_Neue, Archivo } from "next/font/google";
import type { PosterVariantProps } from "../poster-types";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export function ClassicPoster({
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
      {/* Bandeau institutionnel */}
      <div className="h-2 w-full" style={{ backgroundColor: primaryColor }} />
      <header className="flex items-center justify-between border-b border-slate-200 px-10 py-6">
        <div className="flex items-center gap-3">
          {logoSrc ? (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-50 ring-1 ring-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt={`Logo ${clubName}`}
                className="max-h-full max-w-full object-contain"
              />
            </span>
          ) : null}
          <div>
            <p className={`${bebas.className} text-2xl tracking-[0.12em]`}>
              {clubName} · {sport}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Canal de signalement confidentiel
            </p>
          </div>
        </div>
        <div className={`${bebas.className} text-lg tracking-[0.2em]`} style={{ color: primaryColor }}>
          ClubSafe
        </div>
      </header>

      {/* Corps */}
      <div className="flex flex-1 flex-col justify-center px-10 py-8">
        <div className="grid grid-cols-[1fr_auto] items-center gap-10">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-slate-900">
              Violences, harcèlement,
              <br />
              discriminations :{" "}
              <span className="underline decoration-4 underline-offset-4" style={{ color: primaryColor, textDecorationColor: primaryColor }}>
                osez en parler.
              </span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-slate-600">
              {clubName} met à votre disposition un canal de signalement{" "}
              <b>100 % confidentiel</b> : vous écrivez directement au club, pour toute
              violence, harcèlement, agression ou discrimination vécue ou observée dans le
              cadre de la pratique sportive.
            </p>

            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                { icon: "🔒", title: "100 % anonyme", text: "possible" },
                { icon: "📱", title: "Suivi simple", text: "sans compte" },
                { icon: "⏱️", title: "Réponse", text: "sous 7 jours" },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                  <p className="text-xl">{f.icon}</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{f.title}</p>
                  <p className="text-xs text-slate-500">{f.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="rounded-2xl border-4 p-3" style={{ borderColor: primaryColor }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QR code de signalement" className="h-56 w-56" />
            </div>
            <p className="mt-3 max-w-[14rem] text-center text-sm font-semibold text-slate-700">
              Scannez pour écrire au club — signaler, témoigner, poser une question
            </p>
            <p className="mt-1 text-xs font-bold tracking-wide" style={{ color: primaryColor }}>
              {trackingUrl.replace(/^https?:\/\//, "")}
            </p>
          </div>
        </div>
      </div>

      {/* Mentions légales */}
      <div className="mx-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm font-bold text-slate-900">Vos obligations, nos engagements</p>
        <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-slate-600">
          <li>
            ⚖️ Les faits susceptibles de constituer des infractions pénales sont transmis au{" "}
            <b>Procureur de la République</b> (Art. 40 du Code de procédure pénale) et signalés à la
            cellule <b>Signal-Sports</b> : <b className="font-mono">0 800 05 95 95</b>.
          </li>
          <li>
            🛡️ Aucune sanction ne peut être prise à l&apos;encontre d&apos;un adhérent qui signale de bonne foi.
          </li>
          <li>
            ⛔ En cas de <b>danger immédiat</b>, appelez le <b>17</b> (police/gendarmerie) avant d&apos;utiliser
            ce canal.
          </li>
        </ul>
      </div>

      <footer className="mt-auto flex items-center justify-between px-10 py-6 text-[11px] text-slate-400">
        <span>{clubName} — document de prévention diffusé dans les lieux d&apos;activité.</span>
        <span>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())}</span>
      </footer>
      <div className="h-2 w-full" style={{ backgroundColor: primaryColor }} />
    </div>
  );
}