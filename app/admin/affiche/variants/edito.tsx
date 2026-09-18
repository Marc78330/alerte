"use client";

import { Archivo, Bebas_Neue } from "next/font/google";
import type { PosterVariantProps } from "../poster-types";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const archivo = Archivo({ subsets: ["latin"], weight: ["300", "400", "500", "700", "900"] });

export function EditoPoster({
  clubName,
  sport,
  primaryColor,
  trackingUrl,
  logoSrc,
  qrDataUrl,
}: PosterVariantProps) {
  return (
    <div
      className="flex h-[1086px] w-[768px] flex-col bg-[#faf9f6] text-slate-900"
      style={{ fontFamily: archivo.style.fontFamily }}
    >
      {/* Folio */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 px-12 py-4">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
          ClubSafe — La parole libère
        </p>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">
          N°{new Date().getFullYear()}
        </p>
      </div>

      {/* Masthead */}
      <div className="border-b-2 border-slate-900 px-12 py-5 text-center">
        <p className="text-[13px] font-bold uppercase tracking-[0.5em] text-slate-500">
          {clubName} · {sport}
        </p>
        <h1 className={`${bebas.className} mt-1 text-[76px] leading-none tracking-[0.06em]`}>
          OSEZ EN PARLER
        </h1>
        <p className="mx-auto mt-1 max-w-md text-[13px] italic text-slate-500">
          Violence, harcèlement, discrimination : votre club vous offre un canal de
          signalement confidentiel — la réalité ne disparaît pas parce qu&apos;on se tait.
        </p>
      </div>

      {/* Colonnes */}
      <div className="grid flex-1 grid-cols-[1fr_190px] gap-10 border-b-2 border-slate-900 px-12 py-8">
        <div>
          <p className="inline-block bg-slate-900 px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-white">
            Victime ou témoin ?
          </p>
          <h2 className={`${bebas.className} mt-4 text-[54px] leading-[0.92] tracking-wide`}>
            Dites-le
            <br />
            <span className="text-slate-400">haut et fort,</span>
            <br />
            <span className="border-b-[6px]" style={{ color: primaryColor, borderColor: primaryColor }}>
              en douce
            </span>
            .
          </h2>

          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-slate-600">
            {clubName} met en place un canal <b>100 % confidentiel</b> : vous écrivez
            directement au club. Selon votre choix, témoignage anonyme ou identifié, avec
            un suivi de votre dossier sous 7 jours.
          </p>

          <div className="mt-5 max-w-sm space-y-4">
            {[
              { n: "A", t: "Écoute confidentielle", d: "Anonyme possible en toutes circonstances" },
              { n: "B", t: "Suivi par code secret", d: "Sans création de compte" },
              { n: "C", t: "Sous 7 jours", d: "Réponse du club garantie" },
            ].map((f, i) => (
              <div key={f.n} className="flex items-start gap-3 border-t border-slate-200 pt-3">
                <span className={`${bebas.className} text-2xl`} style={{ color: primaryColor }}>
                  {f.n}/
                </span>
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-slate-900">{f.t}</p>
                  <p className="text-xs text-slate-500">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne droite : QR encadré */}
        <div className="flex flex-col items-center justify-start border-l-2 border-slate-900 pl-8">
          <div className="border-[3px] border-slate-900 bg-white p-3 shadow-[8px_8px_0_0_#0f172a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR code de signalement" className="h-40 w-40" />
          </div>
          <p className={`${bebas.className} mt-4 text-center text-2xl leading-none tracking-[0.15em]`} style={{ color: primaryColor }}>
            SCANNEZ
            <br />
            POUR
            <br />
            ÉCRIRE&nbsp;AU
            <br />
            CLUB
          </p>
          <p className="mt-3 break-all text-center text-[11px] font-semibold text-slate-400">
            {trackingUrl.replace(/^https?:\/\//, "")}
          </p>
          <div className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-center text-white">
            <p className={`${bebas.className} text-2xl tracking-wider`}>Écrire au club</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
              {clubName} · confidentiel · gratuit
            </p>
          </div>
        </div>
      </div>

      {/* Mentions */}
      <div className="grid flex-1 grid-cols-3 gap-6 px-12 py-5 text-[11px] leading-relaxed text-slate-500">
        <p>
          <b className="uppercase text-slate-700">Art. 40 CPP</b> — les faits graves sont transmis
          au Procureur de la République et à Signal-Sports.
        </p>
        <p>
          <b className="uppercase text-slate-700">Bonne foi</b> — aucune sanction contre un
          signalement fait de bonne foi.
        </p>
        <p>
          <b className="uppercase text-slate-700">Urgence</b> — danger immédiat ? Appelez le{" "}
          <b className="text-slate-900">17</b> avant de signaler.
        </p>
      </div>

      {/* Pic */}
      <div className="flex items-center justify-between border-t-2 border-slate-900 bg-slate-900 px-12 py-3.5 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
          {clubName} — document de prévention
        </p>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
          {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())}
        </p>
      </div>
    </div>
  );
}