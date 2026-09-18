import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@fc-etoile.fr";
  const passwordHash = await bcrypt.hash("admin123", 12);

  const club = await prisma.club.upsert({
    where: { slug: "fc-etoile" },
    update: {
      name: "FC Étoile Sportive",
      sport: "Football",
      contactEmail: "president@fc-etoile.fr",
      primaryColor: "#0284c7",
      alertEmails: "president@fc-etoile.fr",
      welcomeMessage:
        "Ce canal est un espace d'écoute confidentiel. Si vous constatez un fait de violence, de harcèlement ou de discrimination, vous pouvez le signaler ici, même anonymement.",
    },
    create: {
      name: "FC Étoile Sportive",
      slug: "fc-etoile",
      sport: "Football",
      contactEmail: "president@fc-etoile.fr",
      primaryColor: "#0284c7",
      alertEmails: "president@fc-etoile.fr",
      welcomeMessage:
        "Ce canal est un espace d'écoute confidentiel. Si vous constatez un fait de violence, de harcèlement ou de discrimination, vous pouvez le signaler ici, même anonymement.",
    },
  });

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, clubId: club.id },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Présidence FC Étoile",
      role: "ADMIN",
      clubId: club.id,
    },
  });

  const superAdminEmail = "superadmin@clubsafe.fr";
  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: { passwordHash, role: "SUPER_ADMIN", clubId: club.id },
    create: {
      email: superAdminEmail,
      passwordHash,
      name: "ClubSafe Plateforme",
      role: "SUPER_ADMIN",
      clubId: club.id,
    },
  });

  const categories = [
    {
      key: "HARCELEMENT",
      label: "Harcèlement et mise à l'écart",
      description:
        "Moqueries répétées, humiliations, mise à l'écart d'un adhérent par ses pairs ou par un encadrant.",
      severity: 2,
      sortOrder: 1,
    },
    {
      key: "CYBER",
      label: "Cyberharcèlement (réseaux, groupes WhatsApp)",
      description:
        "Messages ou publications malveillants, diffusions de photos, harcèlement en ligne sur les réseaux sociaux ou groupes de discussion.",
      severity: 2,
      sortOrder: 2,
    },
    {
      key: "SEXISME_SEXUEL",
      label: "Comportements ou propos sexistes et sexuels",
      description:
        "Propos à caractère sexuel, gestes déplacés, avances non consenties, agressions sexuelles. À signaler prioritairement.",
      severity: 3,
      sortOrder: 3,
    },
    {
      key: "VIOLENCE_PHYSIQUE",
      label: "Violences physiques et agressions",
      description:
        "Coups, bousculades volontaires, agressions physiques entre adhérents ou commises par un encadrant.",
      severity: 3,
      sortOrder: 4,
    },
    {
      key: "DISCRIMINATION",
      label: "Discriminations (racisme, homophobie, etc.)",
      description:
        "Propos ou comportements discriminatoires fondés sur l'origine, le genre, l'orientation sexuelle, le handicap ou la religion.",
      severity: 2,
      sortOrder: 5,
    },
  ];

  for (const cat of categories) {
    await prisma.clubCategory.upsert({
      where: { clubId_key: { clubId: club.id, key: cat.key } },
      update: cat,
      create: { ...cat, clubId: club.id },
    });
  }

  console.log("✅ Seed terminé : club FC Étoile Sportive, admin club, super-admin plateforme, 5 catégories.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });