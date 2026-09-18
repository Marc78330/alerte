import type { Metadata } from "next";
import { Building2, ExternalLink, CheckCircle2 } from "lucide-react";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clubPublicUrl } from "@/lib/club-url";
import { AdminNav } from "../_components/admin-nav";
import { CreateClubForm } from "./create-club-form";
import { ClubActions } from "./club-actions";

export const metadata: Metadata = { title: "Console plateforme — ClubSafe" };

export default async function PlateformePage({
  searchParams,
}: {
  searchParams: Promise<{ cree?: string }>;
}) {
  await requireSuperAdmin();
  const { cree } = await searchParams;

  const clubs = await prisma.club.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      users: { select: { email: true } },
      _count: { select: { reports: true } },
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 pb-16">
      <AdminNav
        backHref="/admin/dashboard"
        backLabel="Retour au bureau"
      />
      <div className="mx-auto max-w-7xl px-5 py-8">
        {cree === "1" && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Club créé. L&apos;administrateur peut se
            connecter dès maintenant.
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Console plateforme</h1>
            <p className="text-sm text-slate-500">
              Gérez les clubs et leurs URLs. Chaque club dispose de son espace bureau, scindé
              par session.
            </p>
          </div>
        </div>

        {/* Création */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Créer un nouveau club</h2>
          <p className="mt-1 text-sm text-slate-500">
            Crée le club, ses 5 catégories de faits et le compte administrateur en une fois.
          </p>
          <div className="mt-5">
            <CreateClubForm />
          </div>
        </section>

        {/* Liste */}
        <section className="mt-10">
          <h2 className="text-base font-bold text-slate-900">
            Clubs ({clubs.length})
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Club</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Domaine personnalisé</th>
                  <th className="px-4 py-3 font-semibold">Admin</th>
                  <th className="px-4 py-3 font-semibold">Signalements</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clubs.map((club) => (
                  <tr key={club.id} className={club.isActive ? "" : "bg-red-50/40"}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 rounded-full"
                          style={{ backgroundColor: club.primaryColor }}
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{club.name}</p>
                          <p className="text-xs text-slate-400">{club.sport}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">/{club.slug}</td>
                    <td className="px-4 py-3 text-xs">
                      {club.customDomain ? (
                        <span className="font-mono text-blue-600">{club.customDomain}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {club.users.map((u) => u.email).join(", ")}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{club._count.reports}</td>
                    <td className="px-4 py-3">
                      {club.isActive ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          Actif
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                          Suspendu
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={clubPublicUrl({ slug: club.slug, customDomain: club.customDomain })}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Réserver<ExternalLink className="h-3 w-3" />
                        </a>
                        <ClubActions
                          clubId={club.id}
                          isActive={club.isActive}
                          customDomain={club.customDomain}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {clubs.length === 0 ? (
            <p className="mt-6 text-center text-sm text-slate-500">
              Aucun club pour le moment.
            </p>
          ) : null}

          {clubs.some((c) => !c.customDomain) ? (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
              💡 Pour utiliser un domaine personnalisé, pointez le domaine (ex.
              signalement.monclub.fr) vers cette plateforme en enregistrement A/CNAME, puis
              définissez-le dans la colonne « Domaine personnalisé ».
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}