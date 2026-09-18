"use client";

import { useActionState, useState } from "react";
import { createClubAction, type PlatformResult } from "./actions";

const initialState: PlatformResult = {};

export function CreateClubForm() {
  const [state, formAction, pending] = useActionState(createClubAction, initialState);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const autoSlug = () =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Nom du club *
          </label>
          <input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(autoSlug());
            }}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label htmlFor="sport" className="mb-1 block text-sm font-medium text-slate-700">
            Sport *
          </label>
          <input
            id="sport"
            name="sport"
            required
            placeholder="Football, Basket, Rugby…"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium text-slate-700">
            Identifiant (slug) *
          </label>
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <p className="mt-1 text-xs text-slate-400">
            Sert à l&apos;URL par défaut : /club/{slug || "…"}/signalement
          </p>
        </div>
        <div>
          <label htmlFor="primaryColor" className="mb-1 block text-sm font-medium text-slate-700">
            Couleur principale
          </label>
          <div className="flex items-center gap-2">
            <input
              id="primaryColor"
              name="primaryColor"
              type="color"
              defaultValue="#2563eb"
              className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
            />
            <span className="text-xs text-slate-500">Affiches, formulaires, logo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium text-slate-700">
            Email de contact du club *
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            placeholder="contact@monclub.fr"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label htmlFor="customDomain" className="mb-1 block text-sm font-medium text-slate-700">
            Domaine personnalisé (optionnel)
          </label>
          <input
            id="customDomain"
            name="customDomain"
            placeholder="signalement.monclub.fr"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <p className="mt-1 text-xs text-slate-400">
            Pointez le domaine vers cette plateforme pour remplacer /club/…
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <p className="mb-3 text-sm font-semibold text-slate-800">
          Compte administrateur du club
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="adminEmail" className="mb-1 block text-sm font-medium text-slate-700">
              Email de l&apos;administrateur *
            </label>
            <input
              id="adminEmail"
              name="adminEmail"
              type="email"
              required
              placeholder="bureau@monclub.fr"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label htmlFor="adminPassword" className="mb-1 block text-sm font-medium text-slate-700">
              Mot de passe (8 caractères min) *
            </label>
            <input
              id="adminPassword"
              name="adminPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Création…" : "Créer le club"}
      </button>
    </form>
  );
}