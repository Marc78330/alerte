import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ShieldCheck, FolderSearch, LockKeyhole, EyeOff, MessageSquareText, BellRing, UserRound, Clock, Ear, AudioWaveform, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { clubLogoUrl } from "@/lib/club-logo";
import { ReportForm } from "./report-form";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const club = await prisma.club.findUnique({
    where: { slug },
    select: { name: true },
  });
  return {
    title: club
      ? `Signalement confidentiel — ${club.name}`
      : "Signalement confidentiel",
  };
}

export default async function SignalementPage({ params }: Props) {
  const { slug } = await params;
  const club = await prisma.club.findUnique({
    where: { slug },
    include: {
      categories: {
        where: { isEnabled: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!club) notFound();
  if (!club.isActive) redirect(`/club/${club.slug}/desactive`);

  const logoUrl = club.logoFileName ? clubLogoUrl(club.slug) : null;
  const landingSubtitle = club.landingSubtitle?.trim() || club.welcomeMessage;
  const landingBanner =
    club.landingBanner?.trim() ||
    "Cette démarche est <b>portée par votre club</b> : signaler un fait, ce n'est pas dénoncer, c'est <b>protéger</b>. Votre parole compte, et le club s'engage à traiter chaque signalement avec sérieux et confidentialité. Ce formulaire est <b>gratuit, sans création de compte</b>, et vous pouvez choisir de signaler <b>100 % anonymement</b> : votre identité ne sera jamais demandée ni enregistrée. Les échanges avec le club se font via un code confidentiel.";

  return (
    <main
      className="min-h-screen bg-slate-50"
      style={{ "--club-primary": club.primaryColor } as React.CSSProperties}
    >
      {/* Fond décoratif */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -right-24 h-96 w-96 rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: "var(--club-primary)" }}
        />
        <div
          className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: "var(--club-primary)" }}
        />
        <div
          className="absolute top-1/3 left-1/2 h-72 w-72 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: "var(--club-primary)" }}
        />
      </div>

      {/* Hero — STOP à la violence */}
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(55rem 35rem at 70% -20%, ${club.primaryColor}55, transparent 60%), radial-gradient(35rem 25rem at 0% 120%, ${club.primaryColor}33, transparent 60%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        {/* Étoiles décoratives */}
        <div className="pointer-events-none absolute left-[8%] top-10 h-2 w-2 rounded-full bg-white/30" />
        <div className="pointer-events-none absolute right-[12%] top-20 h-1.5 w-1.5 rounded-full bg-white/20" />
        <div className="pointer-events-none absolute left-[16%] bottom-16 h-1.5 w-1.5 rounded-full bg-white/25" />

        <div className="relative mx-auto max-w-3xl px-5 py-10 sm:py-12">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 ring-1 ring-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={`Logo ${club.name}`} className="max-h-full max-w-full object-contain" />
              </span>
            ) : (
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                style={{ backgroundColor: "var(--club-primary)" }}
              >
                <ShieldCheck className="h-6 w-6" />
              </span>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                {club.name}
              </p>
              <p className="text-sm font-semibold text-white/90">Signalement confidentiel</p>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-white"
                style={{ backgroundColor: "var(--club-primary)" }}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--club-primary)" }} />
                </span>
                Stop à la violence
              </span>

              <h1 className="mt-4 text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl">
                Parle&nbsp;.
                <br />
                <span className="bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
                  On t&apos;écoute.
                </span>
              </h1>

              <p className="mt-4 text-base leading-relaxed text-slate-300">
                {landingSubtitle}
              </p>
            </div>

            {/* Emblème écoute */}
            <div className="hidden shrink-0 sm:block">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <span
                  className="absolute inset-0 animate-pulse rounded-full border border-white/10"
                  style={{ animationDuration: "3s" }}
                />
                <span
                  className="absolute inset-3 rounded-full border border-white/15"
                />
                <span
                  className="absolute inset-6 flex items-center justify-center rounded-full text-white shadow-2xl"
                  style={{ backgroundColor: "var(--club-primary)" }}
                >
                  <Ear className="h-8 w-8" />
                </span>
                <span className="absolute -right-1 top-6 flex items-end gap-0.5">
                  {[6, 10, 14, 9].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-white/50"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            {["100 % anonyme", "Sans compte", "Réponse sous 7 jours"].map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-slate-200 backdrop-blur"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-3xl px-5 py-10">
        {/* Introduction */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-7">
          {/* Bandeau confidentialité */}
          <div className="relative">
            <div className="flex items-start gap-4">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg">
                <span
                  className="absolute inset-0 rounded-2xl"
                  style={{ backgroundColor: "var(--club-primary)", opacity: 0.12 }}
                />
                <LockKeyhole className="h-5 w-5" style={{ color: "var(--club-primary)" }} />
              </span>
              <p
                className="text-sm leading-relaxed text-slate-600 sm:text-[15px]"
                dangerouslySetInnerHTML={{ __html: landingBanner }}
              />
            </div>
            <div className="relative mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-slate-100 pt-3.5 text-xs font-semibold text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-3.5 w-3.5" style={{ color: "var(--club-primary)" }} />
                Sans compte
              </span>
              <span className="inline-flex items-center gap-1.5">
                <EyeOff className="h-3.5 w-3.5" style={{ color: "var(--club-primary)" }} />
                Anonyme possible
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" style={{ color: "var(--club-primary)" }} />
                Réponse sous 7 jours
              </span>
            </div>
          </div>

          {/* Comment ça marche */}
          <div className="mt-6 flex flex-col gap-1 border-t border-slate-100 pt-5 sm:flex-row sm:items-stretch sm:gap-1">
            {[
              {
                icon: EyeOff,
                t: "Choisis ton anonymat",
                d: "Anonyme ou confidentiel, à toi de décider.",
              },
              {
                icon: MessageSquareText,
                t: "Décris les faits",
                d: "Simple et rapide, sans jugement.",
              },
              {
                icon: BellRing,
                t: "Le club agit",
                d: "Réponse sous 7 jours, code de suivi privé.",
              },
            ].map((s, i) => (
              <div key={s.t} className="flex flex-1 items-center">
                <div className="flex h-full w-full items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-slate-200 hover:bg-slate-50">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                    style={{ backgroundColor: "var(--club-primary)" }}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                      Étape {i + 1}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-slate-900">{s.t}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.d}</p>
                  </div>
                </div>
                {i < 2 && (
                  <span
                    className="flex w-5 shrink-0 items-center justify-center self-center"
                    style={{ color: "var(--club-primary)" }}
                  >
                    <ChevronRight className="animate-arrow-hop h-4 w-4 rotate-90 sm:rotate-0" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="mt-8">
          <ReportForm
            clubId={club.id}
            clubName={club.name}
            primaryColor={club.primaryColor}
            allowAnonymous={club.allowAnonymous}
            requireTeamInfo={club.requireTeamInfo}
            categories={club.categories.map((c) => ({
              key: c.key,
              label: c.label,
              description: c.description,
              severity: c.severity,
            }))}
          />
        </div>

        {/* Déjà signalé */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <FolderSearch className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">Tu as déjà signalé&nbsp;?</p>
              <p className="text-xs text-slate-500">Retrouve ton dossier avec ton code de suivi.</p>
            </div>
          </div>
          <Link
            href="/suivi"
            className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
            style={{ backgroundColor: "var(--club-primary)" }}
          >
            Suivre mon dossier
          </Link>
        </div>

        {club.footerMentions?.trim() && (
          <footer className="mt-10 border-t border-slate-200 pt-6 pb-2 text-center text-xs leading-relaxed text-slate-400">
            {club.footerMentions}
          </footer>
        )}
      </div>
    </main>
  );
}