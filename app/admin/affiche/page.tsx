import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { clubLogoUrl } from "@/lib/club-logo";
import { clubPublicUrl } from "@/lib/club-url";
import { AdminNav } from "../_components/admin-nav";
import { PosterManager } from "./poster-manager";

export const metadata: Metadata = { title: "Affiche vestiaire — ClubSafe" };

export default async function AffichePage() {
  const admin = await requireAdmin();
  const url = clubPublicUrl({ slug: admin.club.slug, customDomain: admin.club.customDomain });
  const logoSrc = admin.club.logoFileName ? clubLogoUrl(admin.club.slug) : null;

  return (
    <main className="min-h-screen bg-slate-100 pb-10">
      <AdminNav
        backHref="/admin/dashboard"
        backLabel="Tableau de bord"
        logoSrc={logoSrc}
        isSuperAdmin={admin.role === "SUPER_ADMIN"}
      />
      <div className="pt-6">
        <PosterManager
          clubName={admin.club.name}
          sport={admin.club.sport}
          primaryColor={admin.club.primaryColor}
          trackingUrl={url}
          logoSrc={logoSrc}
          initialStyle={admin.club.posterStyle}
        />
      </div>
    </main>
  );
}