"use client";

import { useMemo, useState, type DragEvent } from "react";
import {
  EyeOff,
  UserRound,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Check,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Link2,
  Megaphone,
  Laptop,
  ShieldAlert,
  Users,
  HeartCrack,
  CalendarDays,
  MapPin,
  FileText,
  FileImage,
  Music,
  File as FileIcon,
  LockKeyhole,
} from "lucide-react";
import { submitReportAction, type ReportSubmitResult } from "@/app/actions/report";
import { REPORTER_ROLES } from "@/lib/constants";

type CategoryOption = {
  key: string;
  label: string;
  description: string;
  severity: number;
};

type Props = {
  clubId: string;
  clubName: string;
  primaryColor: string;
  allowAnonymous: boolean;
  requireTeamInfo: boolean;
  categories: CategoryOption[];
};

const STEPS = [
  { n: "01", label: "Discrétion" },
  { n: "02", label: "Faits" },
  { n: "03", label: "Récit" },
];

function darken(hex: string, factor: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.round(((n >> 16) & 255) * factor);
  const g = Math.round(((n >> 8) & 255) * factor);
  const b = Math.round((n & 255) * factor);
  return `rgb(${r} ${g} ${b})`;
}

function categoryStyle(key: string) {
  switch (key) {
    case "HARCELEMENT":
      return { icon: Megaphone, bg: "#fef3c7", fg: "#b45309" };
    case "CYBER":
      return { icon: Laptop, bg: "#ede9fe", fg: "#6d28d9" };
    case "VIOLENCE_PHYSIQUE":
      return { icon: ShieldAlert, bg: "#fee2e2", fg: "#b91c1c" };
    case "SEXISME_SEXUEL":
      return { icon: HeartCrack, bg: "#fce7f3", fg: "#be185d" };
    case "DISCRIMINATION":
      return { icon: Users, bg: "#dbeafe", fg: "#1d4ed8" };
    default:
      return { icon: ShieldAlert, bg: "#e2e8f0", fg: "#475569" };
  }
}

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "heic"].includes(ext)) return FileImage;
  if (["mp3", "m4a", "wav", "ogg"].includes(ext)) return Music;
  if (ext === "pdf") return FileText;
  return FileIcon;
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
  return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
}

const severityPill = (level: number) => {
  if (level === 3)
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
        Urgence
      </span>
    );
  if (level === 2)
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
        Grave
      </span>
    );
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
      Modéré
    </span>
  );
};

export function ReportForm({
  clubId,
  clubName,
  primaryColor,
  allowAnonymous,
  requireTeamInfo,
  categories,
}: Props) {
  const [step, setStep] = useState(0);
  const [anonymity, setAnonymity] = useState<"ANONYME" | "CONFIDENTIEL">(
    allowAnonymous ? "ANONYME" : "CONFIDENTIEL",
  );
  const [reporterRole, setReporterRole] = useState("");
  const [categoryKey, setCategoryKey] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isMinorVictim, setIsMinorVictim] = useState(false);
  const [reporterName, setReporterName] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [teamCategory, setTeamCategory] = useState("");
  const [description, setDescription] = useState("");
  const [locationDetail, setLocationDetail] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReportSubmitResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const cssVars = useMemo(
    () =>
      ({
        "--club-primary": primaryColor,
        "--club-primary-dark": darken(primaryColor, 0.82),
        "--club-primary-soft": `${primaryColor}22`,
        "--club-primary-softer": `${primaryColor}11`,
      }) as React.CSSProperties,
    [primaryColor],
  );

  const canNext =
    step === 0
      ? true
      : step === 1
        ? Boolean(
            reporterRole &&
              (categoryKey
                ? categoryKey !== "__AUTRE__" || customCategory.trim().length >= 3
                : false),
          )
        : description.trim().length >= 40;

  const descProgress = Math.min(100, Math.round((description.trim().length / 40) * 100));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, 5);
    setFiles(next);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  async function handleSubmit() {
    setError(null);
    setPending(true);
    const fd = new FormData();
    fd.set("clubId", clubId);
    fd.set("isAnonymous", String(anonymity === "ANONYME"));
    fd.set("allowAnonymousFlag", String(allowAnonymous));
    fd.set("reporterRole", reporterRole);
    fd.set("categoryKey", categoryKey === "__AUTRE__" ? "__AUTRE__" : categoryKey);
    fd.set("customCategory", customCategory);
    fd.set("isMinorVictim", String(isMinorVictim));
    fd.set("reporterName", reporterName);
    fd.set("reporterContact", reporterContact);
    fd.set("teamCategory", teamCategory);
    fd.set("description", description);
    fd.set("locationDetail", locationDetail);
    fd.set("incidentDate", incidentDate);
    for (const f of files) fd.append("files", f);

    const res = await submitReportAction(fd);
    setPending(false);
    if (!res.ok) {
      setError(res.error ?? "Une erreur est survenue. Merci de réessayer.");
      setStep(2);
      return;
    }
    setResult(res);
    setStep(3);
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-club focus:bg-white focus:outline-none focus:ring-2 focus:ring-club/20";

  if (result && result.ok) {
    return (
      <section
        className="animate-fade-up overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60"
        style={cssVars}
      >
        <div className="relative overflow-hidden px-6 py-10 text-center sm:px-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(28rem 14rem at 50% 0%, ${primaryColor}22, transparent 70%)`,
            }}
          />
          <div className="relative flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 shadow-lg shadow-emerald-200/50">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
              C&apos;est fait, merci.
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              Le bureau de <b>{clubName}</b> a bien reçu votre signalement et s&apos;engage à
              y répondre sous 7 jours. Grâce au code ci-dessous, suivez l&apos;instruction
              <b> sans révéler votre identité</b>.
            </p>
          </div>
        </div>

        <div className="mx-5 mb-5 rounded-2xl bg-slate-900 px-6 py-6 text-center text-white sm:mx-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">
            Votre code de suivi confidentiel
          </p>
          <p className="mt-2 font-mono text-2xl font-bold tracking-[0.2em] sm:text-3xl">
            {result.trackingToken}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(result.trackingToken);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
          >
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copié !" : "Copier le code"}
          </button>
        </div>

        <div className="mx-5 mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-900 sm:mx-10">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            <b>Important :</b> ce code est votre <b>unique accès</b> au suivi et à la
            conversation. Conservez-le précieusement — s&apos;il est perdu, rien ne permet de
            le retrouver.
          </p>
        </div>

        <div className="mx-5 mb-6 flex flex-col gap-3 sm:mx-10 sm:flex-row">
          <a
            href={`/suivi/${result.trackingToken}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
            style={{ backgroundColor: "var(--club-primary)" }}
          >
            <Link2 className="h-4 w-4" />
            Accéder à mon espace de suivi
          </a>
          <button
            onClick={() => window.print()}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Imprimer / garder mon code
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="animate-fade-up overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60"
      style={cssVars}
    >
      {/* ===== HEADER ÉTAPES ===== */}
      <div className="border-b border-slate-100 bg-white px-6 pb-0 pt-6 sm:px-10">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.label} className="flex flex-1 items-center gap-2">
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => done && setStep(i)}
                  aria-label={s.label}
                  className={`flex items-center gap-2 rounded-xl px-1 py-1 transition ${
                    done ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                      done
                        ? "bg-emerald-500 text-white"
                        : active
                          ? "animate-step-pop bg-club text-white shadow-md"
                          : "bg-slate-100 text-slate-400"
                    }`}
                    style={
                      active
                        ? ({ "--pulse-color": `${primaryColor}66` } as React.CSSProperties)
                        : undefined
                    }
                  >
                    {done ? (
                      <Check className="animate-step-pop h-4 w-4" />
                    ) : active ? (
                      <span className="animate-soft-pulse">{s.n}</span>
                    ) : (
                      s.n
                    )}
                  </span>
                  <span
                    className={`hidden text-xs font-bold transition sm:block ${
                      active ? "text-slate-900" : done ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span
                      key={done ? "done" : active ? "active" : `wait-${i}`}
                      className="animate-bar-grow block h-full rounded-full"
                      style={{
                        width: done ? "100%" : active ? "50%" : "0%",
                        backgroundColor: done
                          ? "#10b981"
                          : active
                            ? "var(--club-primary)"
                            : "#e2e8f0",
                      }}
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-8 sm:px-10 sm:py-10">
        {/* ===== ÉTAPE 1 : DISCRÉTION ===== */}
        {step === 0 && (
          <div key="step-0" className="animate-slide-in">
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900">
              Choisis ton mode de signalement
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500">
              À toi de décider ce qui te met le plus à l&apos;aise. Les deux restent confidentiels.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {/* ===== ANONYMAT ===== */}
              <button
                type="button"
                onClick={() => allowAnonymous && setAnonymity("ANONYME")}
                disabled={!allowAnonymous}
                className={`relative flex flex-col rounded-2xl border-2 p-6 text-left transition ${
                  anonymity === "ANONYME"
                    ? "border-club bg-club-softer shadow-[0_0_0_1px_var(--club-primary)]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                } ${!allowAnonymous ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg"
                    style={{ backgroundColor: "var(--club-primary)" }}
                  >
                    <EyeOff className="h-6 w-6" />
                  </span>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                      anonymity === "ANONYME"
                        ? "border-club bg-club text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {anonymity === "ANONYME" && <Check className="h-4 w-4" />}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-slate-900">
                  Anonymat complet
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  Personne — même le club — ne saura qui tu es.
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-slate-200/70 pt-4 text-sm">
                  {[
                    { ok: true, t: "Aucune donnée personnelle demandée" },
                    { ok: true, t: "Le club ne peut pas t'identifier" },
                    { ok: true, t: "Suivi via ton code privé" },
                    { ok: false, t: "Le club ne peut pas te recontacter hors du tchat" },
                    { ok: false, t: "Code perdu = dossier perdu" },
                  ].map((it) => (
                    <li key={it.t} className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          it.ok ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-400"
                        }`}
                      >
                        {it.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </span>
                      <span className={it.ok ? "text-slate-700" : "text-slate-400"}>{it.t}</span>
                    </li>
                  ))}
                </ul>
              </button>

              {/* ===== CONFIDENTIEL ===== */}
              <button
                type="button"
                onClick={() => setAnonymity("CONFIDENTIEL")}
                className={`relative flex flex-col rounded-2xl border-2 p-6 text-left transition ${
                  anonymity === "CONFIDENTIEL"
                    ? "border-club bg-club-softer shadow-[0_0_0_1px_var(--club-primary)]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                } cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white shadow-lg">
                    <UserRound className="h-6 w-6" />
                  </span>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                      anonymity === "CONFIDENTIEL"
                        ? "border-club bg-club text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {anonymity === "CONFIDENTIEL" && <Check className="h-4 w-4" />}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-slate-900">
                  Identité confidentielle
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  Le président du club peut te joindre, sans jamais te dévoiler aux autres.
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-slate-200/70 pt-4 text-sm">
                  {[
                    { ok: true, t: "Le président peut te recontacter directement" },
                    { ok: true, t: "Résolution souvent plus rapide" },
                    { ok: true, t: "Ton identité n'est jamais divulguée" },
                    { ok: false, t: "Le président connaît ton identité" },
                    { ok: false, t: "Pour ceux qui sont à l'aise de se dévoiler" },
                  ].map((it) => (
                    <li key={it.t} className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          it.ok ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-400"
                        }`}
                      >
                        {it.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </span>
                      <span className={it.ok ? "text-slate-700" : "text-slate-400"}>{it.t}</span>
                    </li>
                  ))}
                </ul>
              </button>
            </div>
          </div>
        )}

        {/* ===== ÉTAPE 2 : FAITS ===== */}
        {step === 1 && (
          <div key="step-1" className="animate-slide-in">
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900">
              Quels sont les faits&nbsp;?
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500">
              Sans pression, au plus près de ce que tu as vécu ou constaté.
            </p>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Tu signales en tant que
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {REPORTER_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setReporterRole(role)}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition ${
                      reporterRole === role
                        ? "border-club bg-club-softer text-slate-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Nature des faits
              </p>
              <div className="mt-3 space-y-2.5">
                {categories.map((cat) => {
                  const { icon: Icon, bg, fg } = categoryStyle(cat.key);
                  const isSelected = categoryKey === cat.key;
                  return (
                    <label
                      key={cat.key}
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition ${
                        isSelected
                          ? "border-club bg-club-softer"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.key}
                        checked={isSelected}
                        onChange={() => setCategoryKey(cat.key)}
                        className="sr-only"
                      />
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: bg, color: fg }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-3">
                          <span className="font-bold text-slate-900">{cat.label}</span>
                          {severityPill(cat.severity)}
                        </span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">
                          {cat.description}
                        </span>
                      </span>
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          isSelected
                            ? "border-club bg-club text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </span>
                    </label>
                  );
                })}

                {/* Option "Autre" */}
                <div
                  className={`rounded-2xl border-2 p-4 transition ${
                    categoryKey === "__AUTRE__"
                      ? "border-club bg-club-softer"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <label className="flex cursor-pointer items-center gap-4">
                    <input
                      type="radio"
                      name="category"
                      value="__AUTRE__"
                      checked={categoryKey === "__AUTRE__"}
                      onChange={() => setCategoryKey("__AUTRE__")}
                      className="sr-only"
                    />
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <FileIcon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-bold text-slate-900">Autre situation</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">
                        Aucune catégorie ne correspond&nbsp;? Précise en quelques mots.
                      </span>
                    </span>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        categoryKey === "__AUTRE__"
                          ? "border-club bg-club text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {categoryKey === "__AUTRE__" && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </label>
                  {categoryKey === "__AUTRE__" && (
                    <div className="animate-fade-up mt-4">
                      <label
                        htmlFor="customCategory"
                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                      >
                        Nature des faits
                      </label>
                      <input
                        id="customCategory"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        maxLength={100}
                        className={inputCls}
                        placeholder="Ex. : menaces, pressions, propos dégradants…"
                      />
                      <p className="mt-1 text-xs text-slate-400">
                        {customCategory.length}/100 caractères
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <label className="mt-6 flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 p-4 transition hover:border-slate-400">
              <input
                type="checkbox"
                checked={isMinorVictim}
                onChange={(e) => setIsMinorVictim(e.target.checked)}
                className="h-5 w-5 accent-club"
              />
              <span className="text-sm text-slate-700">
                La victime est-elle <b>mineure</b>&nbsp;? (procédure renforcée et prioritaire)
              </span>
            </label>

            {anonymity === "CONFIDENTIEL" ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="reporterName" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Ton nom
                  </label>
                  <input
                    id="reporterName"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className={inputCls}
                    placeholder="Prénom Nom"
                  />
                </div>
                <div>
                  <label htmlFor="reporterContact" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Contact (email ou téléphone)
                  </label>
                  <input
                    id="reporterContact"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className={inputCls}
                    placeholder="Un moyen de te joindre"
                  />
                </div>
              </div>
            ) : (
              <div className="hidden">
                <input value={reporterName} onChange={(e) => setReporterName(e.target.value)} />
                <input value={reporterContact} onChange={(e) => setReporterContact(e.target.value)} />
              </div>
            )}

            {requireTeamInfo && (
              <div className="mt-4">
                <label htmlFor="teamCategory" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Équipe / catégorie concernée
                </label>
                <input
                  id="teamCategory"
                  value={teamCategory}
                  onChange={(e) => setTeamCategory(e.target.value)}
                  className={inputCls}
                  placeholder="Ex. : U15, Équipe féminine senior…"
                />
              </div>
            )}
          </div>
        )}

        {/* ===== ÉTAPE 3 : RÉCIT ===== */}
        {step === 2 && (
          <div key="step-2" className="animate-slide-in">
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900">
              Raconte ce que tu as vécu
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500">
              Guide-toi avec&nbsp;: <b>Où&nbsp;?</b> <b>Quand&nbsp;?</b>{" "}
              <b>Que s&apos;est-il passé&nbsp;?</b>
            </p>

            <div className="relative mt-8">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                maxLength={8000}
                placeholder="Ex. : Le samedi 12 à l'entraînement U15 au gymnase municipal, l'éducateur a tenu des propos humiliants envers un joueur devant tout le groupe, puis…"
                className={`w-full resize-none rounded-2xl border-2 px-4 py-4 text-sm leading-relaxed transition focus:outline-none focus:ring-2 ${
                  description.trim().length >= 40
                    ? "border-emerald-300 bg-emerald-50/40 focus:border-emerald-500 focus:ring-emerald-100"
                    : "border-slate-200 bg-slate-50/60 focus:border-club focus:bg-white focus:ring-club/20"
                }`}
              />
              <span
                className={`absolute right-3 bottom-3 rounded-lg px-2 py-1 text-[11px] font-bold tabular-nums ${
                  description.trim().length >= 40
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {description.trim().length}/40
              </span>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${descProgress}%`,
                    backgroundColor: descProgress >= 100 ? "#10b981" : "var(--club-primary)",
                  }}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="incidentDate" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Date des faits (si connue)
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="incidentDate"
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="locationDetail" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Lieu des faits
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="locationDetail"
                    value={locationDetail}
                    onChange={(e) => setLocationDetail(e.target.value)}
                    className={`${inputCls} pl-10`}
                    placeholder="Vestiaires, parking, terrain d'honneur…"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-bold text-slate-900">
                Pièces jointes <span className="font-normal text-slate-400">(facultatif)</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Photos, captures, audios… 5 max., 15 Mo par fichier.
              </p>
              <label
                htmlFor="file-input"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-sm transition ${
                  dragOver
                    ? "border-club bg-club-softer"
                    : "border-slate-300 bg-slate-50/60 text-slate-600 hover:border-club hover:bg-club-softer"
                }`}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg"
                  style={{ backgroundColor: "var(--club-primary)" }}
                >
                  <Upload className="h-5 w-5" />
                </span>
                <span className="font-bold text-slate-800">
                  {files.length > 0 ? `${files.length} fichier${files.length > 1 ? "s" : ""} sélectionné${files.length > 1 ? "s" : ""}` : "Ajouter des fichiers"}
                </span>
                <span className="text-xs text-slate-500">
                  Cliquez ou glissez-déposez vos fichiers ici
                </span>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.mp3,.m4a,.wav,.txt"
                  onChange={(e) => addFiles(e.target.files)}
                  className="sr-only"
                />
              </label>
              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((f, i) => {
                    const Icon = fileIcon(f.name);
                    return (
                      <li
                        key={`${f.name}-${i}`}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 truncate font-medium text-slate-700">{f.name}</span>
                        <span className="shrink-0 text-xs text-slate-400">{formatFileSize(f.size)}</span>
                        <button
                          type="button"
                          onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                          className="rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label="Retirer ce fichier"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-900">
              <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                <b>Bon à savoir :</b> le club doit répondre sous 7 jours. En cas de danger
                immédiat, appelez le <b>17</b> avant de signaler ici.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          {step > 0 && step < 3 ? (
            <button
              type="button"
              onClick={() => (step === 2 && error ? setStep(2) : setStep(step - 1))}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" /> Retour
            </button>
          ) : (
            <span />
          )}

          {step === 0 || step === 1 ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setStep(step + 1)}
              style={{ backgroundColor: canNext ? "var(--club-primary)" : undefined }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-300 px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              Continuer <ChevronRight className="h-4 w-4" />
            </button>
          ) : step === 2 ? (
            <button
              type="button"
              disabled={!canNext || pending}
              onClick={handleSubmit}
              style={{ backgroundColor: "var(--club-primary)" }}
              className="inline-flex items-center gap-1.5 rounded-xl px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {pending ? "Transmission sécurisée…" : "Envoyer mon signalement"}
              {!pending && <ChevronRight className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}