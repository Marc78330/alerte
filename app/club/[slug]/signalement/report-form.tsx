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

const STEPS = ["Discrétion", "Faits", "Récit"];

function darken(hex: string, factor: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.round(((n >> 16) & 255) * factor);
  const g = Math.round(((n >> 8) & 255) * factor);
  const b = Math.round((n & 255) * factor);
  return `rgb(${r} ${g} ${b})`;
}

function categoryIcon(key: string) {
  switch (key) {
    case "HARCELEMENT":
      return Megaphone;
    case "CYBER":
      return Laptop;
    case "VIOLENCE_PHYSIQUE":
      return ShieldAlert;
    case "SEXISME_SEXUEL":
      return HeartCrack;
    case "DISCRIMINATION":
      return Users;
    default:
      return ShieldAlert;
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
        ? Boolean(reporterRole && categoryKey)
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
    fd.set("categoryKey", categoryKey);
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

  if (result && result.ok) {
    return (
      <section
        className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        style={cssVars}
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">Signalement transmis</h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Le bureau de <b>{clubName}</b> a bien reçu votre signalement et s&apos;y engage à
            répondre sous 7 jours. Grâce au code ci-dessous, vous pourrez suivre son
            instruction <b>sans révéler votre identité</b>.
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-100 p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Votre code de suivi confidentiel
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-[0.15em] text-slate-900 sm:text-3xl">
            {result.trackingToken}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(result.trackingToken);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copié !" : "Copier le code"}
          </button>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            <b>Important :</b> ce code est votre <b>unique accès</b> à l&apos;espace de suivi
            et à la conversation avec le club. Conservez-le précieusement (photo, note
            privée). Si vous le perdez, nous ne pourrons pas le retrouver : aucun lien avec
            votre identité n&apos;est conservé.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={`/suivi/${result.trackingToken}`}
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow transition"
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

  const selectedCardClasses =
    "border-club bg-club-softer shadow-[0_0_0_1px_var(--club-primary)]";

  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      style={cssVars}
    >
      {/* Étapes */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-8">
        <ol className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                disabled={i > step}
                onClick={() => i < step && setStep(i)}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                  i < step
                    ? "bg-emerald-500 text-white"
                    : i === step
                      ? "text-white shadow-md"
                      : "bg-slate-200 text-slate-500"
                } ${i < step ? "cursor-pointer hover:bg-emerald-600" : ""}`}
                style={i === step ? { backgroundColor: "var(--club-primary)" } : undefined}
                aria-label={i < step ? `Revenir à l'étape : ${label}` : `Étape ${label}`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </button>
              <span
                className={`hidden text-xs font-semibold sm:block ${
                  i <= step ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={`h-0.5 flex-1 rounded-full transition-colors ${
                    i < step ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">
          Étape {step + 1} sur {STEPS.length}
        </p>
      </div>

      <div className="px-5 py-6 sm:px-8 sm:py-8">
        {step === 0 && (
          <div className="animate-fade-up">
            <h2 className="text-lg font-bold text-slate-900">Comment souhaitez-vous signaler ?</h2>
            <p className="mt-1 text-sm text-slate-600">
              Ce choix reste totalement confidentiel dans tous les cas.
            </p>

            <div className="mt-5 space-y-4">
              <button
                type="button"
                onClick={() => allowAnonymous && setAnonymity("ANONYME")}
                disabled={!allowAnonymous}
                className={`relative w-full rounded-2xl border-2 p-5 text-left transition ${
                  anonymity === "ANONYME"
                    ? selectedCardClasses
                    : "border-slate-200 bg-white hover:border-slate-300"
                } ${!allowAnonymous ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                <span
                  className={`absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-2 transition ${
                    anonymity === "ANONYME"
                      ? "border-club bg-club text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {anonymity === "ANONYME" && <Check className="h-3.5 w-3.5" />}
                </span>
                <div className="flex items-start gap-4 pr-8">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ backgroundColor: "var(--club-primary)" }}
                  >
                    <EyeOff className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Anonymat absolu</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      Aucune information personnelle n&apos;est demandée ni enregistrée. Le
                      club ne pourra jamais vous identifier, seul l&apos;échange via votre
                      code de suivi est possible.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAnonymity("CONFIDENTIEL")}
                className={`relative w-full rounded-2xl border-2 p-5 text-left transition ${
                  anonymity === "CONFIDENTIEL"
                    ? selectedCardClasses
                    : "border-slate-200 bg-white hover:border-slate-300"
                } cursor-pointer`}
              >
                <span
                  className={`absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-2 transition ${
                    anonymity === "CONFIDENTIEL"
                      ? "border-club bg-club text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {anonymity === "CONFIDENTIEL" && <Check className="h-3.5 w-3.5" />}
                </span>
                <div className="flex items-start gap-4 pr-8">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-white shadow-sm">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Identité confidentielle</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      Vos nom et coordonnées restent dans un espace privé réservé au
                      président du club, pour un échange plus direct si nécessaire. Jamais
                      divulgués.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-up">
            <h2 className="text-lg font-bold text-slate-900">Quels sont les faits ?</h2>
            <p className="mt-1 text-sm text-slate-600">Vous signalez en tant que… (votre rôle)</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {REPORTER_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setReporterRole(role)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    reporterRole === role
                      ? selectedCardClasses
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <p className="mt-6 text-sm font-medium text-slate-700">Nature des faits à signaler</p>
            <div className="mt-3 space-y-3">
              {categories.map((cat) => {
                const Icon = categoryIcon(cat.key);
                const isSelected = categoryKey === cat.key;
                return (
                  <label
                    key={cat.key}
                    className={`relative flex cursor-pointer gap-4 rounded-2xl border-2 p-4 transition ${
                      isSelected
                        ? selectedCardClasses
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
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
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                        isSelected ? "text-white" : "bg-slate-100 text-slate-500"
                      }`}
                      style={isSelected ? { backgroundColor: "var(--club-primary)" } : undefined}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-900">{cat.label}</span>
                        {severityPill(cat.severity)}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                        {cat.description}
                      </span>
                    </span>
                    <span
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        isSelected ? "border-club bg-club text-white" : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                  </label>
                );
              })}
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={isMinorVictim}
                onChange={(e) => setIsMinorVictim(e.target.checked)}
                className="mt-0.5 h-5 w-5 accent-club"
              />
              <span className="text-sm text-slate-700">
                La victime est-elle <b>mineure</b> ? (cette information déclenche une
                procédure renforcée et prioritaire)
              </span>
            </label>

            {anonymity === "CONFIDENTIEL" ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="reporterName" className="mb-1 block text-sm font-medium text-slate-700">
                    Votre nom
                  </label>
                  <input
                    id="reporterName"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Prénom Nom"
                  />
                </div>
                <div>
                  <label htmlFor="reporterContact" className="mb-1 block text-sm font-medium text-slate-700">
                    Contact (email ou téléphone)
                  </label>
                  <input
                    id="reporterContact"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Laissez un moyen de vous joindre"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 hidden">
                <input value={reporterName} onChange={(e) => setReporterName(e.target.value)} />
                <input value={reporterContact} onChange={(e) => setReporterContact(e.target.value)} />
              </div>
            )}

            {requireTeamInfo && (
              <div className="mt-4">
                <label htmlFor="teamCategory" className="mb-1 block text-sm font-medium text-slate-700">
                  Équipe / catégorie concernée
                </label>
                <input
                  id="teamCategory"
                  value={teamCategory}
                  onChange={(e) => setTeamCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Ex. : U15, Équipe féminine senior…"
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-up">
            <h2 className="text-lg font-bold text-slate-900">Racontez les faits</h2>
            <p className="mt-1 text-sm text-slate-600">
              Décrivez le déroulement précisément. Guidez-vous avec : <b>Où ?</b>{" "}
              <b>Quand ?</b> <b>Que s&apos;est-il passé ?</b>
            </p>

            <div className="relative mt-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                maxLength={8000}
                placeholder="Ex. : Le samedi 12 à l'entraînement U15 au gymnase municipal, l'éducateur a tenu des propos humiliants envers un joueur devant tout le groupe, puis…"
                className={`w-full rounded-xl border px-3.5 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 ${
                  description.trim().length >= 40
                    ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              <span
                className={`absolute right-3 bottom-3 rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
                  description.trim().length >= 40
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {description.trim().length}/40
              </span>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
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
                <label htmlFor="incidentDate" className="mb-1 block text-sm font-medium text-slate-700">
                  Date des faits (si connue)
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="incidentDate"
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="locationDetail" className="mb-1 block text-sm font-medium text-slate-700">
                  Lieu des faits
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="locationDetail"
                    value={locationDetail}
                    onChange={(e) => setLocationDetail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Vestiaires, parking, terrain d'honneur…"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-slate-700">
                Pièces jointes (photos, captures, audios… facultatif)
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Stockées de façon sécurisée et confidentielle (5 max., 15 Mo par fichier).
              </p>
              <label
                htmlFor="file-input"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-7 text-sm transition ${
                  dragOver
                    ? "border-club bg-club-softer"
                    : "border-slate-300 bg-slate-50 text-slate-600 hover:border-club hover:bg-club-softer"
                }`}
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-sm"
                  style={{ backgroundColor: "var(--club-primary)" }}
                >
                  <Upload className="h-5 w-5" />
                </span>
                <span className="font-semibold text-slate-800">
                  {files.length > 0 ? `${files.length} fichier${files.length > 1 ? "s" : ""} sélectionné${files.length > 1 ? "s" : ""}` : "Ajouter des fichiers"}
                </span>
                <span className="text-xs text-slate-500">
                  Cliquez pour parcourir ou glissez-déposez vos fichiers ici
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
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-slate-700">{f.name}</span>
                        <span className="shrink-0 text-xs text-slate-400">
                          {formatFileSize(f.size)}
                        </span>
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

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                <b>Bon à savoir :</b> votre signalement est horodaté et votre club a
                l&apos;obligation d&apos;y répondre dans un délai maximal de 7 jours. En cas
                d&apos;urgence grave immédiate (danger en cours), appelez le <b>17</b> avant
                de signaler ici.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-300 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continuer <ChevronRight className="h-4 w-4" />
            </button>
          ) : step === 2 ? (
            <button
              type="button"
              disabled={!canNext || pending}
              onClick={handleSubmit}
              style={{ backgroundColor: "var(--club-primary)" }}
              className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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