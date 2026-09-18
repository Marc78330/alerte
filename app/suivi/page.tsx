import type { Metadata } from "next";
import Link from "next/link";
import { Folders, ArrowLeft } from "lucide-react";
import { TrackingLookupForm } from "./tracking-lookup";

export const metadata: Metadata = { title: "Consulter mon dossier — ClubSafe" };

export default function SuiviLookupPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
          <Folders className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-center text-2xl font-bold text-slate-900">
          Consulter mon dossier
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Retrouvez le suivi de votre signalement et vos échanges avec le club grâce à
          votre code confidentiel.
        </p>

        <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <TrackingLookupForm />
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}