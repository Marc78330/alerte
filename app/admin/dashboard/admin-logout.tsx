"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { logoutAction } from "../login/actions";

export function AdminLogoutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => logoutAction())}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
    >
      <LogOut className="h-3.5 w-3.5" />
      {pending ? "Déconnexion…" : "Déconnexion"}
    </button>
  );
}