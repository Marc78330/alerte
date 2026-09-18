"use client";

import { useActionState } from "react";
import { KeyRound, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { changePasswordAction, type SettingsResult } from "./actions";

const initialState: SettingsResult = {};

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <KeyRound className="h-5 w-5 text-slate-400" /> Mot de passe du compte
      </h2>

      {state.ok && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> Mot de passe modifié.
        </p>
      )}
      {!state.ok && "error" in state && state.error && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          <AlertTriangle className="h-3.5 w-3.5" /> {state.error}
        </p>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Mot de passe actuel</label>
          <input
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nouveau mot de passe (8 caractères minimum)
          </label>
          <input
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        Changer le mot de passe
      </button>
    </form>
  );
}