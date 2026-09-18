import { z } from "zod";
import { REPORTER_ROLES } from "./constants";

export const reportFormSchema = z.object({
  clubId: z.string().min(1, "Club manquant"),
  isAnonymous: z.boolean(),
  reporterRole: z.enum(REPORTER_ROLES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Rôle du déclarant requis" }),
  }),
  categoryKey: z.string().min(1, "Veuillez sélectionner un type de faits"),
  isMinorVictim: z.boolean().default(false),
  reporterName: z.string().max(150).optional().nullable(),
  reporterContact: z.string().max(300).optional().nullable(),
  teamCategory: z.string().max(150).optional().nullable(),
  description: z
    .string()
    .min(40, "Merci de décrire les faits avec au moins quelques phrases (40 caractères minimum).")
    .max(8000, "La description est limitée à 8000 caractères."),
  locationDetail: z.string().max(200).optional().nullable(),
  incidentDate: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const messageSchema = z.object({
  reportId: z.string().min(1),
  content: z.string().min(1, "Message vide").max(4000, "Message trop long (4000 caractères max)"),
});

export const statusSchema = z.object({
  reportId: z.string().min(1),
  status: z.enum(["NOUVEAU", "EN_COURS", "TRANSMIS_AUTORITES", "RESOLU"]),
});

export const settingsSchema = z.object({
  name: z.string().min(2, "Nom du club requis").max(100),
  sport: z.string().min(1, "Sport requis").max(80),
  contactEmail: z.string().email("Email de contact invalide"),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur hexadécimale invalide (#RRGGBB)"),
  welcomeMessage: z.string().max(600, "Message d'accueil trop long (600 caractères max)"),
  allowAnonymous: z.boolean(),
  requireTeamInfo: z.boolean(),
  alertEmails: z.string().max(1000, "Liste d'emails trop longue"),
  landingTitle: z.string().max(120, "Titre de page trop long (120 caractères max)").optional().nullable(),
  landingSubtitle: z.string().max(600, "Sous-titre trop long (600 caractères max)").optional().nullable(),
  landingBanner: z.string().max(600, "Bannière trop longue (600 caractères max)").optional().nullable(),
  footerMentions: z.string().max(1000, "Mentions trop longues (1000 caractères max)").optional().nullable(),
});

export const categorySchema = z.object({
  id: z.string().optional(),
  key: z
    .string()
    .min(2, "Clé trop courte")
    .max(40)
    .regex(/^[A-Z0-9_]+$/, "Clé: majuscules, chiffres et underscores uniquement"),
  label: z.string().min(2, "Libellé trop court").max(100),
  description: z.string().max(300, "Description limitée à 300 caractères").optional().default(""),
  severity: z.coerce.number().int().min(1).max(3),
  isEnabled: z.boolean(),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(8, "Le nouveau mot de passe doit faire au moins 8 caractères"),
});