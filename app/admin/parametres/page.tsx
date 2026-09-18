import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clubLogoUrl } from "@/lib/club-logo";
import { clubPublicUrl } from "@/lib/club-url";
import { AdminNav } from "../_components/admin-nav";
import { SettingsForm } from "./settings-form";
import { CategoriesManager } from "./categories-manager";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "Paramètres du club — ClubSafe" };

export default async function ParametresPage() {
  const admin = await requireAdmin();
  const categories = await prisma.clubCategory.findMany({
    where: { clubId: admin.clubId },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <main className="min-h-screen bg-slate-100 pb-16">
      <AdminNav
        backHref="/admin/dashboard"
        backLabel="Tableau de bord"
        logoSrc={admin.club.logoFileName ? clubLogoUrl(admin.club.slug) : null}
        isSuperAdmin={admin.role === "SUPER_ADMIN"}
      />
      <div className="mx-auto max-w-4xl space-y-6 px-5 py-8">
        <h1 className="text-xl font-bold text-slate-900">Paramètres du club</h1>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">URL publique de votre canal</h2>
          <p className="mt-1 text-xs text-slate-500">
            C&apos;est l&apos;adresse pointée par le QR code de l&apos;affiche.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              href={clubPublicUrl({ slug: admin.club.slug, customDomain: admin.club.customDomain })}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-blue-50 px-3 py-2 font-mono text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              {clubPublicUrl({ slug: admin.club.slug, customDomain: admin.club.customDomain })}
            </a>
            {admin.club.customDomain ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Domaine personnalisé
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                URL par défaut
              </span>
            )}
          </div>
        </div>

        <SettingsForm
          initial={{
            name: admin.club.name,
            sport: admin.club.sport,
            contactEmail: admin.club.contactEmail,
            primaryColor: admin.club.primaryColor,
            welcomeMessage: admin.club.welcomeMessage,
            allowAnonymous: admin.club.allowAnonymous,
            requireTeamInfo: admin.club.requireTeamInfo,
            alertEmails: admin.club.alertEmails,
            logoUrl: admin.club.logoFileName ? clubLogoUrl(admin.club.slug) : null,
            landingTitle: admin.club.landingTitle,
            landingSubtitle: admin.club.landingSubtitle,
            landingBanner: admin.club.landingBanner,
            footerMentions: admin.club.footerMentions,
          }}
        />

        <CategoriesManager
          categories={categories.map((c) => ({
            id: c.id,
            key: c.key,
            label: c.label,
            description: c.description,
            severity: c.severity,
            isEnabled: c.isEnabled,
          }))}
        />

        <PasswordForm />
      </div>
    </main>
  );
}