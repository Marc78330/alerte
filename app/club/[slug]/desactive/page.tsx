import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, Clock } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const club = await prisma.club.findUnique({
    where: { slug },
    select: { name: true },
  });
  return { title: club ? `Canal suspendu — ${club.name}` : "Canal suspendu" };
}

export default async function ClubDesactivePage({ params }: Props) {
  const { slug } = await params;
  const club = await prisma.club.findUnique({
    where: { slug },
    select: { name: true, customDomain: true, isActive: true },
  });

  if (!club || club.isActive) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
          <ShieldAlert className="h-7 w-7 text-amber-600" />
        </div>
        <h1 className="mt-5 text-lg font-bold text-slate-900">
          Ce canal de signalement est temporairement suspendu
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Le club {club.name} a momentanément désactivé son canal de signalement.
          Merci de réessayer plus tard.
        </p>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" /> Administrateurs : reconnectez-vous pour réactiver
          le club depuis la console.
        </p>
      </div>
    </main>
  );
}