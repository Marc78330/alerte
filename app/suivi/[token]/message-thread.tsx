"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, ShieldCheck, UserRound } from "lucide-react";
import { sendSuiviMessageAction } from "@/app/actions/suivi";

type Message = {
  id: string;
  senderType: string;
  content: string;
  createdAt: string;
};

type Props = {
  reportId: string;
  trackingToken: string;
  clubName: string;
  primaryColor: string;
  messages: Message[];
};

function timeAgo(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function MessageThread({
  reportId,
  trackingToken,
  clubName,
  primaryColor,
  messages,
}: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);
    const fd = new FormData();
    fd.set("reportId", reportId);
    fd.set("token", trackingToken);
    fd.set("content", text.trim());

    startTransition(async () => {
      const res = await sendSuiviMessageAction(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setText("");
      router.refresh();
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    });
  }

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Échanges sécurisés
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Un espace de dialogue direct avec le bureau de {clubName}. Aucune identité n'est
          divulguée.
        </p>
      </div>

      <div className="max-h-[26rem] space-y-4 overflow-y-auto bg-slate-50 px-5 py-5 sm:px-6">
        {messages.length === 0 ? (
          <p className="rounded-xl bg-white px-4 py-4 text-center text-sm text-slate-500">
            Aucun message pour l'instant. Vous pouvez apporter des précisions ou poser une
            question au club ci-dessous.
          </p>
        ) : (
          messages.map((m) => {
            const isReporter = m.senderType === "REPORTER";
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isReporter ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isReporter ? "bg-slate-200 text-slate-600" : "text-white"
                  }`}
                  style={!isReporter ? { backgroundColor: primaryColor } : undefined}
                >
                  {isReporter ? (
                    <UserRound className="h-4 w-4" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                </div>
                <div className={`max-w-[78%] ${isReporter ? "text-right" : ""}`}>
                  <div
                    className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isReporter
                        ? "bg-white text-slate-800 shadow-sm"
                        : "bg-slate-800 text-white"
                    }`}
                  >
                    {m.content}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {isReporter ? "Vous" : "Bureau du club"} · {timeAgo(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={submit} className="border-t border-slate-100 p-4 sm:p-5">
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
            placeholder="Écrire un message au bureau du club…"
            className="flex-1 resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={pending || !text.trim()}
            style={{ backgroundColor: primaryColor }}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow transition hover:opacity-90 disabled:opacity-50"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}