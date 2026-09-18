"use client";

import { Archivo, Bebas_Neue } from "next/font/google";
import type { PosterVariantProps } from "../poster-types";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "700"] });

export function NeonPoster({
  clubName,
  sport,
  primaryColor,
  trackingUrl,
  logoSrc,
  qrDataUrl,
}: PosterVariantProps) {
  const glow = {
    color: primaryColor,
    textShadow: `0 0 6px ${primaryColor}, 0 0 24px ${primaryColor}99, 0 0 60px ${primaryColor}55`,
  };
  const boxGlow = {
    boxShadow: `0 0 14px ${primaryColor}66, 0 0 40px ${primaryColor}33, inset 0 0 20px ${primaryColor}22`,
  };
  const gridLines = {
    backgroundImage: `linear-gradient(${primaryColor}22 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}22 1px, transparent 1px)`,
    backgroundSize: "64px 64px",
  };

  return (
    <div
      className="relative flex h-[1086px] w-[768px] flex-col overflow-hidden bg-[#04060f] text-white"
      style={{ fontFamily: archivo.style.fontFamily }}
    >
      {/* Grille néon */}
      <div className="absolute inset-0" style={gridLines} />
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: primaryColor }} />
      <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: primaryColor }} />

      <div className="relative flex h-full flex-col px-12 pb-10 pt-8">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-white/15 pb-4">
          <div className="flex items-center gap-3">
            {logoSrc ? (
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5"
                style={boxGlow}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoSrc}
                  alt={`Logo ${clubName}`}
                  className="max-h-full max-w-full object-contain"
                />
              </span>
            ) : (
              <span className="text-2xl">🛡️</span>
            )}
            <div className={`${bebas.className} text-xl leading-none tracking-[0.14em]`}>
              <p>{clubName}</p>
              <p className="text-sm text-white/60">{sport}</p>
            </div>
          </div>
          <p className={`${bebas.className} text-lg tracking-[0.3em]`} style={glow}>
            CLUBSAFE
          </p>
        </div>

        {/* Titre néon */}
        <div className="mt-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">
            Violences · Harcèlement · Discriminations
          </p>
          <h1 className={`${bebas.className} mt-3 text-[92px] leading-[0.9] tracking-wide`}>
            <span style={glow}>T&#39;a vu ?</span>
            <br />
            <span className="text-white">T&#39;as rien dit</span>
            <br />
            <span className="inline-block pr-2" style={{ ...glow, borderBottom: `3px solid ${primaryColor}` }}>
              ? PARLE AU CLUB.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/70">
            {clubName} affine sa ligne d&apos;écoute : écris directement au club, en toute
            discrétion — <b className="text-white">100 % anonyme</b> si tu le souhaites.
          </p>
        </div>

        {/* QR néon */}
        <div className="mt-9 flex items-center gap-8">
          <div
            className="rounded-2xl border bg-[#060913] p-3"
            style={{ ...boxGlow, borderColor: primaryColor }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR code de signalement" className="h-48 w-48" />
          </div>
          <div className="space-y-2.5">
            {[
              { k: "01", t: "Scanne le QR code" },
              { k: "02", t: "Raconte en 3 questions, au club" },
              { k: "03", t: "Suis en secret, réponse 7 jours" },
            ].map((s) => (
              <p key={s.k} className="flex items-center gap-3 text-sm text-white/85">
                <span className={`${bebas.className} text-lg`} style={glow}>
                  {s.k}
                </span>
                <span className="h-px w-6" style={{ backgroundColor: primaryColor }} />
                {s.t}
              </p>
            ))}
          </div>
        </div>

        {/* CTA numero */}
        <div className="mt-auto">
          <div className="flex items-end justify-between">
            <div>
              <p className={`${bebas.className} text-4xl tracking-[0.1em]`} style={glow}>
                PARLE AU CLUB
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-white/45">
                {clubName} · confidentiel · gratuit
              </p>
            </div>
            <p
              className={`${bebas.className} hidden-on-load rounded-lg border px-3 py-1.5 text-sm tracking-[0.2em]`}
              style={{ borderColor: primaryColor, boxShadow: boxGlow.boxShadow }}
            >
              DANGER ? → 17
            </p>
          </div>

          <div className="mt-5 border-t border-white/15 pt-3 text-[11px] leading-relaxed text-white/40">
            <p>
              Faits graves → le club transmet au <b className="text-white/70">Procureur de la
              République</b> (Art. 40 CPP) et à <b className="text-white/70">Signal-Sports</b>{" "}
              (0 800 05 95 95) · aucun sanction en cas de bonne foi · danger immédiat →{" "}
              <b className="text-white/70">17</b>
            </p>
            <p className="mt-1.5 text-white/60">
              {trackingUrl.replace(/^https?:\/\//, "")} · {clubName} ·{" "}
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}