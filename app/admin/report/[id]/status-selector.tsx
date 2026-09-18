"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { updateReportStatusAction } from "@/app/admin/dashboard/actions";
import { REPORT_STATUSES, SLA_ACK_HOURS } from "@/lib/constants";

const STATUS_ORDER = ["NOUVEAU", "EN_COURS", "TRANSMIS_AUTORITES", "RESOLU"] as const;
type Status = (typeof STATUS_ORDER)[number];

export function StatusSelector({
  reportId,
  currentStatus,
  createdAt,
}: {
  reportId: string;
  currentStatus: string;
  createdAt: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const created = useMemo(() => new Date(createdAt), [createdAt]);
  const slaEnd = useMemo(
    () => new Date(created.getTime() + SLA_ACK_HOURS * 3600 * 1000),
    [created],
  );
  const [slaState, setSlaState] = useState(() => ({ label: "", overdue: false }));

  useEffect(() => {
    const update = () => {
      const remaining = slaEnd.getTime() - Date.now();
      setSlaState({
        overdue: remaining <= 0,
        label:
          remaining <= 0
            ? "Délai dépassé"
            : Math.ceil(remaining / (3600 * 1000)) > 48
              ? `${Math.ceil(remaining / (24 * 3600 * 1000))} j restants`
              : `${Math.ceil(remaining / 3600000)} h restantes pour accuser réception`,
      });
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [slaEnd]);

  async function setStatus(status: Status) {
    setError(null);
    setPending(true);
    const fd = new FormData();
    fd.set("reportId", reportId);
    fd.set("status", status);
    const res = await updateReportStatusAction(fd);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Statut du dossier
      </h2>
      <div
        className={`mt-3 rounded-xl px-4 py-3 text-sm font-semibold ${
          slaState.overdue
            ? "bg-red-100 text-red-700"
            : currentStatus === "NOUVEAU"
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-800"
        }`}
      >
        {REPORT_STATUSES[currentStatus as Status] ?? currentStatus}
        {currentStatus === "NOUVEAU" && (
          <span className="mt-1 flex items-center gap-1.5 text-xs font-normal">
            <AlertTriangle className="h-3.5 w-3.5" /> {slaState.label}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {STATUS_ORDER.map((s) => {
          const active = s === currentStatus;
          const colors: Record<Status, string> = {
            NOUVEAU: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100",
            EN_COURS: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
            TRANSMIS_AUTORITES:
              "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100",
            RESOLU: "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
          };
          return (
            <button
              key={s}
              disabled={pending}
              onClick={() => setStatus(s)}
              className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition disabled:opacity-50 ${
                active ? colors[s] + " ring-2 ring-inset" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {REPORT_STATUSES[s]}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
      {pending && (
        <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Mise à jour…
        </p>
      )}
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Chaque changement est horodaté dans l&apos;historique d&apos;audit.
      </p>
    </section>
  );
}