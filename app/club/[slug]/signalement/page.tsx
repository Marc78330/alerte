import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ShieldCheck, MessageCircleHeart, FolderSearch } from "lucide-react";
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
  const landingTitle =
    club.landingTitle?.trim() ||
    "Vous êtes victime ou témoin de violences, de harcèlement ou de discrimination\u00A0?";
  const landingSubtitle = club.landingSubtitle?.trim() || club.welcomeMessage;
  const landingBanner =
    club.landingBanner?.trim() ||
    "Ce formulaire est <b>gratuit, sans création de compte</b>. Vous pouvez choisir de signaler <b>100 % anonymement</b> : votre identité ne sera jamais demandée ni enregistrée. Les échanges avec le club se font via un code confidentiel.";

  return (
    <main
      className="min-h-screen bg-slate-50"
      style={{ "--club-primary": club.primaryColor } as React.CSSProperties}
    >
      <header className="shade-club text-white">
        <div className="mx-auto max-w-3xl px-5 py-8">
          <div className="flex items-center gap-2 text-sm font-medium text-white/85">
            {logoUrl ? (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={`Logo ${club.name}`} className="max-h-full max-w-full object-contain" />
              </span>
            ) : (
              <ShieldCheck className="h-5 w-5 shrink-0" />
            )}
            <span>Signalement confidentiel — {club.name}</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">{landingTitle}</h1>
          <p className="mt-3 flex items-start gap-2 text-white/90">
            <MessageCircleHeart className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{landingSubtitle}</span>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-8">
        <p
          className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"
          dangerouslySetInnerHTML={{ __html: landingBanner }}
        />

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

        <p className="mt-6 text-center">
          <Link
            href="/suivi"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            <FolderSearch className="h-4 w-4" />
            Vous avez déjà signalé&nbsp;? Retrouvez votre dossier avec votre code de suivi
          </Link>
        </p>

        {club.footerMentions?.trim() && (
          <footer className="mt-10 border-t border-slate-200 pt-6 pb-2 text-center text-xs leading-relaxed text-slate-400">
            {club.footerMentions}
          </footer>
        )}
      </div>
    </main>
  );
}