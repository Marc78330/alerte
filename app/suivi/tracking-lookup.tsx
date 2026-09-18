"use client";

import { useActionState } from "react";
import { LockKeyhole, Search, AlertTriangle } from "lucide-react";
import { lookupSuiviAction, type LookupResult } from "@/app/actions/suivi";

const initialState: LookupResult = {};

export function TrackingLookupForm() {
  const [state, formAction, pending] = useActionState(lookupSuiviAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="token" className="mb-1 block text-sm font-medium text-slate-700">
          Votre code de suivi
        </label>
        <input
          id="token"
          name="token"
          required
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="characters"
          placeholder="SAFE-XXXX-XXXX"
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-center font-mono text-lg font-bold tracking-[0.2em] text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <p className="mt-2 text-xs text-slate-500">
          Le code vous a été communiqué après l'envoi de votre signalement. Il est
          personnel et confidentiel.
        </p>
      </div>

      {state.error ? (
        <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-slate-700 disabled:opacity-60"
      >
        <Search className="h-4 w-4" />
        {pending ? "Recherche en cours…" : "Accéder à mon dossier"}
      </button>

      <p className="flex items-start gap-2 rounded-xl bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600">
        <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
        Aucune identité n'est demandée : seul le code permet d'accéder à votre dossier et
        à la conversation avec le club.
      </p>
    </form>
  );
}