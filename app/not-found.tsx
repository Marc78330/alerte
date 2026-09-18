import Link from "next/link";
import { ShieldOff } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <ShieldOff className="h-10 w-10 text-slate-400" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Page introuvable</h1>
      <p className="mt-3 max-w-sm text-sm text-slate-600">
        Le lien que vous avez suivi est invalide ou la ressource demandée n&apos;existe pas.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
      >
        Revenir à l&apos;accueil
      </Link>
    </main>
  );
}