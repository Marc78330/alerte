"use client";

import { Bebas_Neue, Archivo } from "next/font/google";
import type { PosterVariantProps } from "../poster-types";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

export function SportPoster({
  clubName,
  sport,
  primaryColor,
  trackingUrl,
  logoSrc,
  qrDataUrl,
}: PosterVariantProps) {
  const stripes = {
    backgroundImage: `repeating-linear-gradient(-45deg, ${primaryColor} 0, ${primaryColor} 14px, #fff 14px, #fff 28px)`,
  };

  return (
    <div
      className="h-[1086px] w-[768px] overflow-hidden bg-white text-slate-900"
      style={{ fontFamily: archivo.style.fontFamily }}
    >
      {/* Bandeau supérieur */}
      <header
        className="text-white"
        style={{ background: `linear-gradient(120deg, ${primaryColor} 0%, #0f172a 160%)` }}
      >
        <div className="flex items-center justify-between px-10 py-5">
          <div className="flex items-center gap-2.5">
            {logoSrc ? (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoSrc}
                  alt={`Logo ${clubName}`}
                  className="max-h-full max-w-full object-contain"
                />
              </span>
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl">
                🛡️
              </span>
            )}
            <div className={`${bebas.className} text-xl leading-none`}>
              <p className="tracking-[0.18em]">
                {clubName} · {sport}
              </p>
              <p className="text-xs tracking-[0.3em] text-white/70">ClubSafe</p>
            </div>
          </div>
          <div className={`${bebas.className} rounded-lg bg-black/25 px-3 py-1.5 text-base tracking-[0.15em]`}>
            SIGNALER · TÉMOIGNER · AIDER
          </div>
        </div>
        <div className="h-2.5 w-full" style={stripes} />
      </header>

      {/* Hero */}
      <div className="relative px-10 pb-8 pt-10">
        <div className="grid grid-cols-[1fr_auto] items-center gap-8">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              Il se passe quelque chose ?
            </p>

            <h1 className={`${bebas.className} mt-4 text-[52px] leading-[0.95] tracking-wide text-slate-900`}>
              Victime ou témoin ?
              <br />
              <span className="text-slate-400">Cette fois,</span>
              <br />
              <span
                className="inline-block -rotate-1 px-2 py-0.5 text-white"
                style={{ backgroundColor: primaryColor }}
              >
                OSE EN PARLER.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-700">
              Tu témoignes directement auprès de <b>{clubName}</b>, via un canal{" "}
              <b>100 % confidentiel</b> — pour toute violence, harcèlement, agression ou
              discrimination vécue ou observée dans le cadre du sport. Libre à toi de rester
              anonyme.
            </p>

            <ul className="mt-5 space-y-2 text-sm font-semibold text-slate-800">
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm">🔒</span>
                Écoute 100 % anonyme possible
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sm">📱</span>
                Suivi de ton signalement sans créer de compte
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-sm">⏱️</span>
                Réponse du club sous 7 jours
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <div className="-rotate-2 rounded-[26px] p-3.5 shadow-xl" style={{ backgroundColor: primaryColor }}>
              <div className="rounded-2xl bg-white p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR code de signalement" className="h-52 w-52" />
                <p className={`${bebas.className} mt-2 text-center text-lg tracking-[0.2em] text-slate-900`}>
                  SCANNE-MOI
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-[15rem] text-center text-sm font-semibold leading-snug text-slate-700">
              Signaler, témoigner ou poser une question au club
            </p>
          </div>
        </div>

        {/* Bandeau slogan */}
        <div className="mt-8 flex items-center gap-4">
          <div className={`${bebas.className} -skew-x-6 flex-1 rounded-xl bg-slate-900 px-5 py-3 text-lg tracking-[0.12em] text-white`}>
            <span className="inline-block skew-x-6">La parole libère. Le silence protège les coupables.</span>
          </div>
          <div
            className={`${bebas.className} shrink-0 rounded-xl px-4 py-2 text-center text-xl leading-none tracking-wider text-white`}
            style={{ backgroundColor: primaryColor }}
          >
            Parle au club
            <br />
            <span className="text-xs tracking-[0.2em]">100 % confidentiel</span>
          </div>
        </div>
        <div className="mt-4 h-2 w-full rounded-full" style={stripes} />
      </div>

      {/* Mentions légales */}
      <div className="px-10">
        <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
          <p className={`${bebas.className} text-lg tracking-[0.14em] text-slate-900`}>
            VOS OBLIGATIONS, NOS ENGAGEMENTS
          </p>
          <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-slate-600">
            <li>
              ⚖️ Les faits susceptibles de constituer des infractions pénales sont transmis au{" "}
              <b>Procureur de la République</b> (Art. 40 du Code de procédure pénale) et signalés à
              la cellule <b>Signal-Sports</b> du ministère des Sports :{" "}
              <b className="font-mono">0 800 05 95 95</b> (appel gratuit et confidentiel).
            </li>
            <li>
              🛡️ Aucune sanction ne peut être prise à l&apos;encontre d&apos;un adhérent qui signale de bonne foi.
              Le club garantit un traitement équitable et confidentiel.
            </li>
            <li>
              ⛔ En cas de <b>danger immédiat</b>, appelez le <b>17</b> (police/gendarmerie) avant d&apos;utiliser
              ce canal.
            </li>
          </ul>
        </div>
      </div>

      {/* Pic du bas */}
      <div className="mt-7 px-10">
        <div
          className="flex items-center justify-between rounded-xl px-5 py-3 text-white"
          style={{ background: `linear-gradient(100deg, ${primaryColor} 0%, #0f172a 180%)` }}
        >
          <p className={`${bebas.className} text-lg tracking-[0.12em]`}>
            {trackingUrl.replace(/^https?:\/\//, "")}
          </p>
          <p className="text-[11px] font-medium text-white/75">
            {clubName} — document de prévention ·{" "}
            {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())}
          </p>
        </div>
      </div>
    </div>
  );
}