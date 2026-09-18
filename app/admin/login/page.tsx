import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "./login-form";
import { CookieBlockedNotice } from "./cookie-blocked-notice";

export const metadata: Metadata = { title: "Connexion — Espace club" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Espace club</h1>
          <p className="mt-1 text-sm text-slate-600">
            Connexion réservée au bureau du club
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoginForm />
          <Suspense>
            <CookieBlockedNotice />
          </Suspense>
          <p className="mt-4 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500">
            Compte de démonstration : <b>admin@fc-etoile.fr</b> / <b>admin123</b>
          </p>
        </div>
      </div>
    </main>
  );
}