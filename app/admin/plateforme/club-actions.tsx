"use client";

import { useActionState, useState } from "react";
import { toggleClubActiveAction, setClubDomainAction, type PlatformResult } from "./actions";

type Props = {
  clubId: string;
  isActive: boolean;
  customDomain: string | null;
};

export function ClubActions({ clubId, isActive, customDomain }: Props) {
  const [adminState, adminFormAction, adminPending] = useActionState(
    toggleClubActiveAction,
    {} as PlatformResult,
  );
  const [domainState, domainFormAction, domainPending] = useActionState(
    setClubDomainAction,
    {} as PlatformResult,
  );
  const [domain, setDomain] = useState(customDomain ?? "");
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-2">
      <form action={adminFormAction} className="flex items-center gap-2">
        <input type="hidden" name="clubId" value={clubId} />
        <button
          type="submit"
          disabled={adminPending}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
            isActive
              ? "bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {adminPending ? "…" : isActive ? "Suspendre" : "Réactiver"}
        </button>
        {adminState.error ? (
          <span className="text-xs font-medium text-red-600">{adminState.error}</span>
        ) : null}
      </form>

      {editing ? (
        <form action={domainFormAction} className="flex items-center gap-2">
          <input type="hidden" name="clubId" value={clubId} />
          <input
            name="customDomain"
            value={domain}
            required
            onChange={(e) => setDomain(e.target.value)}
            placeholder="signalement.monclub.fr"
            className="w-48 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={domainPending}
            className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
          >
            Annuler
          </button>
          {domainState.error ? (
            <span className="text-xs font-medium text-red-600">{domainState.error}</span>
          ) : null}
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <span className="max-w-[180px] truncate text-xs font-mono text-slate-500">
            {customDomain ? customDomain : "—"}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
          >
            {customDomain ? "Modifier" : "Définir"}
          </button>
          {domainState.error ? (
            <span className="text-xs font-medium text-red-600">{domainState.error}</span>
          ) : null}
        </div>
      )}
    </div>
  );
}