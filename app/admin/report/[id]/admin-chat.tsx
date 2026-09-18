"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, ShieldCheck, UserRound, Loader2 } from "lucide-react";
import { sendAdminMessageAction } from "@/app/admin/dashboard/actions";

type Message = {
  id: string;
  senderType: string;
  content: string;
  createdAt: string;
};

export function AdminChat({
  reportId,
  trackingToken,
  primaryColor,
  messages,
  isAnonymous,
}: {
  reportId: string;
  trackingToken: string;
  primaryColor: string;
  messages: Message[];
  isAnonymous: boolean;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);
    setPending(true);
    const fd = new FormData();
    fd.set("reportId", reportId);
    fd.set("content", text.trim());
    const res = await sendAdminMessageAction(fd);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setText("");
    startTransition(() => router.refresh());
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Conversation avec le déclarant
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {isAnonymous
            ? `Le déclarant est anonyme. Il vous répond via son code ${trackingToken}.`
            : "Le déclarant a confié son identité au bureau du club."}
        </p>
      </div>

      <div className="max-h-80 space-y-4 overflow-y-auto bg-slate-50 px-5 py-4">
        {messages.length === 0 ? (
          <p className="rounded-xl bg-white px-4 py-4 text-center text-sm text-slate-500">
            Aucun message. Vous pouvez poser un premier question au déclarant pour accuser
            réception et recueillir des précisions.
          </p>
        ) : (
          messages.map((m) => {
            const isAdmin = m.senderType === "ADMIN";
            return (
              <div key={m.id} className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isAdmin ? "text-white" : "bg-slate-200 text-slate-600"
                  }`}
                  style={isAdmin ? { backgroundColor: primaryColor } : undefined}
                >
                  {isAdmin ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <UserRound className="h-4 w-4" />
                  )}
                </div>
                <div className={`max-w-[80%] ${isAdmin ? "text-right" : ""}`}>
                  <div
                    className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isAdmin ? "bg-slate-800 text-white" : "bg-white text-slate-800 shadow-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {isAdmin ? "Vous" : "Déclarant"} ·{" "}
                    {new Intl.DateTimeFormat("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(m.createdAt))}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={send} className="border-t border-slate-100 p-4">
        {error && (
          <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            maxLength={4000}
            placeholder="Répondre au déclarant…"
            className="flex-1 resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            disabled={pending || !text.trim()}
            style={{ backgroundColor: primaryColor }}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow transition hover:opacity-90 disabled:opacity-50"
            aria-label="Envoyer"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </section>
  );
}