"use client";

import { useState, useActionState, useTransition } from "react";
import { Plus, Trash2, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  saveCategoryAction,
  deleteCategoryAction,
  type SettingsResult,
} from "./actions";

type Category = {
  id: string;
  key: string;
  label: string;
  description: string;
  severity: number;
  isEnabled: boolean;
};

const initialState: SettingsResult = {};

const severityHint = (severity: number) =>
  severity === 3
    ? "⚠️ Signalement obligatoire (Procureur, Signal-Sports)"
    : severity === 2
      ? "Mesure conservatoire recommandée"
      : "Médiation interne";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [state, formAction, pending] = useActionState(saveCategoryAction, initialState);
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteCategoryAction,
    initialState,
  );

  const startNew = () =>
    setEditing({ key: "", label: "", description: "", severity: 2, isEnabled: true });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Catégories de signalement</h2>
          <p className="mt-1 text-sm text-slate-500">
            Activez, désactivez ou ajustez le niveau de gravité de chaque catégorie.
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-3.5 w-3.5" /> Ajouter
        </button>
      </div>

      {!state.ok && "error" in state && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          <AlertTriangle className="h-3.5 w-3.5" /> {state.error}
        </p>
      )}
      {!deleteState.ok && "error" in deleteState && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          <AlertTriangle className="h-3.5 w-3.5" /> {deleteState.error}
        </p>
      )}
      {state.ok && pending && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Enregistrement…
        </p>
      )}

      <ul className="mt-5 space-y-3">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`rounded-xl border p-4 ${cat.isEnabled ? "border-slate-200 bg-white" : "border-dashed border-slate-300 bg-slate-50"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900">{cat.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      cat.severity === 3
                        ? "bg-red-600 text-white"
                        : cat.severity === 2
                          ? "bg-amber-500 text-white"
                          : "bg-slate-500 text-white"
                    }`}
                  >
                    Niveau {cat.severity}
                  </span>
                  {!cat.isEnabled && (
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                      Désactivée
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">{cat.description}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  onClick={() =>
                    setEditing({
                      id: cat.id,
                      key: cat.key,
                      label: cat.label,
                      description: cat.description,
                      severity: cat.severity,
                      isEnabled: cat.isEnabled,
                    })
                  }
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Modifier
                </button>
                <ToggleCategory
                  category={cat}
                  disabled={deletePending}
                />
                <form
                  action={deleteAction}
                  onSubmit={(e) => {
                    if (!confirm("Supprimer définitivement cette catégorie ?")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="id" value={cat.id} />
                  <button
                    disabled={deletePending}
                    className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <form action={formAction} className="mt-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
          <h3 className="text-sm font-bold text-slate-900">
            {editing.id ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h3>
          {editing.id && <input type="hidden" name="id" value={editing.id} />}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Clé interne (majuscules, ex. VIOLENCE_PSYCHOLOGIQUE)
              </label>
              <input
                name="key"
                defaultValue={editing.key}
                required
                pattern="[A-Z0-9_]{2,40}"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Libellé</label>
              <input
                name="label"
                defaultValue={editing.label}
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              defaultValue={editing.description}
              rows={2}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Niveau de gravité
              </label>
              <select
                name="severity"
                defaultValue={editing.severity}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value={1}>Niveau 1 — Médiation</option>
                <option value={2}>Niveau 2 — Mesure conservatoire</option>
                <option value={3}>Niveau 3 — Obligation de signalement</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">{severityHint(editing.severity ?? 2)}</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Statut</label>
              <select
                name="isEnabled"
                defaultValue={String(editing.isEnabled)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="true">Activée (visible du public)</option>
                <option value="false">Désactivée</option>
              </select>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing.id ? "Enregistrer" : "Ajouter la catégorie"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function ToggleCategory({ category, disabled }: { category: Category; disabled: boolean }) {
  const [, startTransition] = useTransition();
  const [pending, setPending] = useState(false);

  return (
    <button
      onClick={() => {
        setPending(true);
        const fd = new FormData();
        fd.set("id", category.id);
        fd.set("key", category.key);
        fd.set("label", category.label);
        fd.set("description", category.description);
        fd.set("severity", String(category.severity));
        fd.set("isEnabled", String(!category.isEnabled));
        startTransition(async () => {
          await saveCategoryAction(initialState, fd);
          setPending(false);
        });
      }}
      disabled={disabled || pending}
      title={category.isEnabled ? "Désactiver" : "Activer"}
      className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
        category.isEnabled
          ? "border-slate-200 text-slate-600 hover:bg-slate-50"
          : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
      }`}
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : category.isEnabled ? (
        <EyeOff className="h-3.5 w-3.5" />
      ) : (
        <Eye className="h-3.5 w-3.5" />
      )}
    </button>
  );
}