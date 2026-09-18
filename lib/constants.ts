export const REPORT_STATUSES = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En instruction",
  TRANSMIS_AUTORITES: "Transmis aux autorités",
  RESOLU: "Clôturé",
} as const;

export type ReportStatus = keyof typeof REPORT_STATUSES;

export const REPORTER_ROLES = [
  "Victime",
  "Témoin direct",
  "Parent / représentant légal",
  "Éducateur / encadrant",
  "Membre du bureau",
] as const;

export const SEVERITY_LABELS: Record<number, string> = {
  1: "Niveau 1",
  2: "Niveau 2",
  3: "Niveau 3",
};

export const SLA_ACK_HOURS = 7 * 24; // 7 jours pour accuser réception

export const LEGAL_REFERENCES = {
  signalSports: {
    label: "Signal-Sports",
    phone: "0 800 05 95 95",
    url: "https://signal-sports.france-mutualiste.fr",
    note: "Cellule ministérielle d'écoute et de traitement des signalements (appel gratuit et confidentiel).",
  },
  procureur: {
    label: "Procureur de la République",
    art40: "Art. 40 alinéa 2 du Code de procédure pénale",
    deadline: "48 heures",
    note: "Obligation de signalement sous 48 h pour les faits les plus graves et pour toute victime mineure.",
  },
} as const;

export function formatSeverityLabel(level: number): string {
  return SEVERITY_LABELS[level] ?? `Niveau ${level}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function timeUntil(hours: number): string {
  const d = new Date(Date.now() + hours * 3600 * 1000);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function isSlaBreached(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() > SLA_ACK_HOURS * 3600 * 1000;
}

export function isSlaSoon(createdAt: Date): boolean {
  const remaining = createdAt.getTime() + SLA_ACK_HOURS * 3600 * 1000 - Date.now();
  return remaining > 0 && remaining < 48 * 3600 * 1000;
}