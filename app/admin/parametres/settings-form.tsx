"use client";

import { useActionState } from "react";
import { Save, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { saveClubSettingsAction, type SettingsResult } from "./actions";

const initialState: SettingsResult = {};

export function SettingsForm({
  initial,
}: {
  initial: {
    name: string;
    sport: string;
    contactEmail: string;
    primaryColor: string;
    welcomeMessage: string;
    allowAnonymous: boolean;
    requireTeamInfo: boolean;
    alertEmails: string;
    logoUrl: string | null;
    landingTitle: string | null;
    landingSubtitle: string | null;
    landingBanner: string | null;
    footerMentions: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(saveClubSettingsAction, initialState);

  return (
    <form action={formAction} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-900">Charte graphique du canal</h2>
      <p className="mt-1 text-sm text-slate-500">
        Ces informations sont affichées sur le formulaire et l&apos;affiche.
      </p>

      {state.ok && pending && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Enregistrement…
        </p>
      )}
      {!state.ok && "error" in state && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          <AlertTriangle className="h-3.5 w-3.5" /> {state.error}
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Nom du club
          </label>
          <input
            id="name"
            name="name"
            defaultValue={initial.name}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="sport" className="mb-1 block text-sm font-medium text-slate-700">
            Sport
          </label>
          <input
            id="sport"
            name="sport"
            defaultValue={initial.sport}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium text-slate-700">
            Email du club
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={initial.contactEmail}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="primaryColor" className="mb-1 block text-sm font-medium text-slate-700">
            Couleur principale
          </label>
          <input
            id="primaryColor"
            name="primaryColor"
            type="color"
            defaultValue={initial.primaryColor}
            className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white"
          />
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <h3 className="text-sm font-bold text-slate-900">Logo du club</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Affiché sur la page de signalement, le suivi du dossier, l&apos;affiche et l&apos;espace admin. PNG, JPG, GIF, WEBP ou SVG — 2 Mo max.
        </p>

        <div className="mt-3 flex items-center gap-4">
          {initial.logoUrl ? (
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={initial.logoUrl} alt="Logo du club" className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
              Aucun
            </div>
          )}
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
            className="block w-full max-w-sm text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        {initial.logoUrl && (
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-600">
            <input type="checkbox" name="removeLogo" value="true" className="h-4 w-4 accent-red-600" />
            Supprimer le logo actuel
          </label>
        )}
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <h3 className="text-sm font-bold text-slate-900">Page de démarrage</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Personnalisez la page que voit le déclarant (formulaire de signalement). Les champs vides utilisent les textes par défaut.
        </p>
        <div className="mt-3 space-y-4">
          <div>
            <label htmlFor="landingTitle" className="mb-1 block text-sm font-medium text-slate-700">
              Titre de la page
            </label>
            <input
              id="landingTitle"
              name="landingTitle"
              type="text"
              maxLength={120}
              placeholder="Vous êtes victime ou témoin de violences ou de harcèlement dans notre club ?"
              defaultValue={initial.landingTitle ?? ""}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="landingSubtitle" className="mb-1 block text-sm font-medium text-slate-700">
              Sous-titre
            </label>
            <textarea
              id="landingSubtitle"
              name="landingSubtitle"
              rows={2}
              maxLength={600}
              placeholder={initial.welcomeMessage}
              defaultValue={initial.landingSubtitle ?? ""}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="landingBanner" className="mb-1 block text-sm font-medium text-slate-700">
              Bannière d&apos;information (bandeau sous le titre)
            </label>
            <textarea
              id="landingBanner"
              name="landingBanner"
              rows={2}
              maxLength={600}
              placeholder="Ce formulaire est confidentiel et chiffré. Seuls les membres du bureau y ont accès."
              defaultValue={initial.landingBanner ?? ""}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="footerMentions" className="mb-1 block text-sm font-medium text-slate-700">
              Mentions de bas de page
            </label>
            <textarea
              id="footerMentions"
              name="footerMentions"
              rows={3}
              maxLength={1000}
              placeholder="Contact du club, traitement des signalements, informations RGPD…"
              defaultValue={initial.footerMentions ?? ""}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="welcomeMessage" className="mb-1 block text-sm font-medium text-slate-700">
          Message d&apos;accueil du formulaire
        </label>
        <textarea
          id="welcomeMessage"
          name="welcomeMessage"
          rows={3}
          maxLength={600}
          defaultValue={initial.welcomeMessage}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <input
            type="checkbox"
            name="allowAnonymous"
            defaultChecked={initial.allowAnonymous}
            value="true"
            className="mt-0.5 h-5 w-5 accent-blue-600"
          />
          <span className="text-sm text-slate-700">
            <b>Autoriser le signalement anonyme</b>
            <br />
            <span className="text-xs text-slate-500">Déconseillé de désactiver : réduit fortement les témoignages.</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <input
            type="checkbox"
            name="requireTeamInfo"
            defaultChecked={initial.requireTeamInfo}
            value="true"
            className="mt-0.5 h-5 w-5 accent-blue-600"
          />
          <span className="text-sm text-slate-700">
            <b>Obliger à renseigner l&apos;équipe concernée</b>
            <br />
            <span className="text-xs text-slate-500">Le déclarant devra indiquer la catégorie (U15, senior…).</span>
          </span>
        </label>
      </div>

      <div className="mt-4">
        <label htmlFor="alertEmails" className="mb-1 block text-sm font-medium text-slate-700">
          Emails de notification (séparés par des virgules)
        </label>
        <input
          id="alertEmails"
          name="alertEmails"
          type="text"
          placeholder="president@club.fr, secretaire@club.fr"
          defaultValue={initial.alertEmails}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-slate-500">
          En mode local, les notifications sont journalistisées dans la console (aucun SMTP configuré).
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Enregistrer les paramètres
      </button>
    </form>
  );
}