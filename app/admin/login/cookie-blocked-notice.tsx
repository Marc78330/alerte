"use client";

import { AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SESSION_COOKIE } from "@/lib/session";

export function CookieBlockedNotice() {
  const params = useSearchParams();
  const redirectedFrom = params.get("next");
  const [cookieBlocked, setCookieBlocked] = useState(false);

  useEffect(() => {
    if (!redirectedFrom) return;
    const t = setTimeout(() => {
      setCookieBlocked(!document.cookie.includes(`${SESSION_COOKIE}=`));
    }, 400);
    return () => clearTimeout(t);
  }, [redirectedFrom]);

  if (!cookieBlocked) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
      <p className="flex items-start gap-2 font-semibold">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        Le navigateur bloque le cookie de session local.
      </p>
      <p className="mt-1.5 leading-relaxed">
        Autorisez les cookies pour <b>localhost</b> (ou cette adresse), puis
        reconnectez-vous. Évitez le mode navigation privée strict et les
        extensions qui bloquent les cookies sur ce site.
      </p>
    </div>
  );
}