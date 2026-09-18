import Link from "next/link";
import {
  ShieldCheck,
  MessageSquareLock,
  BookOpenCheck,
  QrCode,
  Lock,
  Timer,
  Scale,
  ArrowRight,
  Building2,
  LayoutDashboard,
  Settings,
  Printer,
  Users,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [clubCount, reportCount] = await Promise.all([
    prisma.club.count(),
    prisma.report.count(),
  ]);

  const features = [
    {
      icon: MessageSquareLock,
      title: "Signalement 100 % anonyme",
      text: "Un canal direct et sans friction pour les adhérents, accessible en un scan via le QR Code affiché dans les vestiaires.",
    },
    {
      icon: Scale,
      title: "Bouclier juridique",
      text: "Le bureau est guidé pas à pas : médiation interne, mesure conservatoire ou saisine du Procureur sous 48 h (Art. 40 CPP).",
    },
    {
      icon: Timer,
      title: "SLA de 7 jours",
      text: "Chaque dossier impose un accusé de réception sous 7 jours, avec alertes automatiques avant le dépassement.",
    },
    {
      icon: Lock,
      title: "Preuve de diligence",
      text: "Chaque action est horodatée et tracée : votre club démontre qu'il n'a jamais fait preuve d'inertie.",
    },
  ];

  const steps = [
    {
      icon: QrCode,
      title: "Une affiche prête à imprimer",
      text: "Générez une affiche A4 personnalisée aux couleurs de votre club, avec un QR Code menant au formulaire confidentiel.",
    },
    {
      icon: MessageSquareLock,
      title: "Le déclarant parle, librement",
      text: "Victime, témoin ou parent : récit guidé, qualification des faits, pièces jointes. Anonymat absolu ou identité protégée.",
    },
    {
      icon: LayoutDashboard,
      title: "Le bureau agit, en sécurité",
      text: "Gravité, SLA, messagerie sécurisée et assistant juridique : le bureau traite chaque dossier sans risque de diffamation.",
    },
  ];

  const clubFeatures = [
    {
      icon: LayoutDashboard,
      title: "Tableau de bord",
      text: "Tous les dossiers, gravités, alertes SLA et relances en un coup d'œil.",
    },
    {
      icon: MessageSquareLock,
      title: "Messagerie protégée",
      text: "Dialogue bidirectionnel avec le déclarant, sans jamais rompre l'anonymat.",
    },
    {
      icon: Scale,
      title: "Assistant juridique",
      text: "Recommandations contextuelles selon la gravité : médiation, conservatoire ou saisine.",
    },
    {
      icon: Printer,
      title: "Affiche & QR Code",
      text: "Une affiche vestiaire professionnelle, prête à imprimer, à vos couleurs.",
    },
    {
      icon: Settings,
      title: "Paramètres du club",
      text: "Catégories de faits, charte graphique, emails d'alerte : tout est configurable.",
    },
    {
      icon: Users,
      title: "Historique d'audit",
      text: "Chaque action tracée et horodatée pour la transparence du bureau.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-900/40">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-base font-bold tracking-tight text-white">
              ClubSafe
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
            <a href="#produit" className="transition hover:text-white">
              Le produit
            </a>
            <a href="#fonctionnement" className="transition hover:text-white">
              Fonctionnement
            </a>
            <a href="#espace-club" className="transition hover:text-white">
              Espace club
            </a>
          </nav>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-blue-50"
          >
            <Building2 className="h-4 w-4" />
            Espace club
          </Link>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60rem 40rem at 70% -10%, rgba(59,130,246,0.35), transparent 60%), radial-gradient(40rem 30rem at 10% 110%, rgba(37,99,235,0.25), transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-200 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Conforme aux obligations des clubs sportifs
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                La parole se libère,
                <br />
                <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                  votre club reste protégé.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                ClubSafe recueille les signalements de violences, harcèlements et
                discriminations en toute confidentialité, puis accompagne votre club
                jusqu'à une résolution conforme. Simple pour les adhérents,
                rassurant pour le bureau.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-900/40 transition hover:from-blue-400 hover:to-blue-500"
                >
                  Découvrir l'espace club
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#produit"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  Voir le produit
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Hébergé 100 % localement
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Aucune donnée cloud
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Anonymat garanti
                </span>
              </div>
            </div>

            {/* Mockup dashboard */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-blue-500/20 to-transparent blur-2xl" />
              <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/40 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-300">
                    Bureau du club
                  </span>
                </div>
                <div className="mt-4 rounded-xl bg-slate-800/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      Dossiers de signalement
                    </span>
                    <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-bold text-blue-300">
                      3
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    <div className="flex items-center justify-between rounded-lg bg-slate-900/70 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          Niv. 3
                        </span>
                        <span className="text-xs font-medium text-slate-200">
                          Harcèlement
                        </span>
                      </div>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        SLA 48 h
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-900/70 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          Niv. 2
                        </span>
                        <span className="text-xs font-medium text-slate-200">
                          Discriminations
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        En cours
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-900/70 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          Niv. 1
                        </span>
                        <span className="text-xs font-medium text-slate-200">
                          Conflit
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        Médiation
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 py-2.5">
                  <Scale className="h-4 w-4 shrink-0 text-blue-300" />
                  <p className="text-[11px] leading-snug text-blue-200">
                    Niveau 3 ou victime mineure → saisine du Procureur sous 48 h
                    (Art. 40 CPP).
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-4 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">Anonyme</p>
                  <p className="text-[11px] text-slate-400">Déclaration protégée</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-slate-900">
              {clubCount.toLocaleString("fr-FR")}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              club{clubCount > 1 ? "s" : ""} équipé{clubCount > 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-slate-900">
              {reportCount.toLocaleString("fr-FR")}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              signalement{reportCount > 1 ? "s" : ""} traité{reportCount > 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-slate-900">100 %</p>
            <p className="mt-1 text-sm font-medium text-slate-500">hébergé localement</p>
          </div>
        </div>
      </section>

      {/* ===== PRODUIT ===== */}
      <section id="produit" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Le produit
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Ce que ClubSafe change pour votre club
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Face au durcissement légal sur les violences sexistes et sexuelles, les
            bénévoles n'ont ni le temps ni l'expertise juridique. ClubSafe évite les
            deux écueils : étouffer une affaire par ignorance, ou créer une diffamation
            en gérant mal un conflit.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <f.icon className="h-5.5 w-5.5" />
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FONCTIONNEMENT ===== */}
      <section id="fonctionnement" className="scroll-mt-24 bg-slate-950 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Fonctionnement
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Trois étapes, zéro complexité
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              De l'affiche dans les vestiaires à la résolution du dossier, tout est
              pensé pour les bénévoles.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur"
              >
                <span className="absolute right-6 top-6 text-5xl font-extrabold text-white/10">
                  0{i + 1}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ESPACE CLUB ===== */}
      <section
        id="espace-club"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 py-20 text-white sm:py-24"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
                <Building2 className="h-4 w-4" />
                Espace club
              </span>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Le bureau de votre club, enfin outillé pour agir
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                Un espace privé et sécurisé où chaque signalement devient un dossier
                clair, priorisé et tracé. Votre club gagne en sérénité, en
                conformité et en confiance.
              </p>
              <ul className="mt-7 space-y-3.5">
                {[
                  "Dossiers centralisés avec gravité et priorité",
                  "Alertes SLA automatiques (accusé sous 7 jours)",
                  "Messagerie confidentielle avec le déclarant",
                  "Assistant juridique adapté à chaque situation",
                  "Affiche vestiaire + QR Code à vos couleurs",
                  "Historique d'audit complet et horodaté",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-blue-50">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow-xl transition hover:bg-blue-50"
                >
                  <Building2 className="h-4 w-4" />
                  Accéder à l'espace club
                </Link>
                <Link
                  href="/suivi"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Suivre un dossier
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {clubFeatures.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur transition hover:bg-white/15"
                >
                  <f.icon className="h-6 w-6 text-blue-200" />
                  <h3 className="mt-3 text-sm font-bold">{f.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-blue-100/80">
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TÉMOIGNAGE ===== */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Quote className="mx-auto h-8 w-8 text-blue-200" />
          <blockquote className="mt-6 text-xl font-semibold leading-relaxed text-slate-800 sm:text-2xl">
            « Avant, on ne savait jamais quoi faire face à un signalement. Aujourd'hui,
            on est guidés étape par étape — et on dort plus tranquilles. »
          </blockquote>
          <p className="mt-6 text-sm font-bold text-slate-900">Secrétaire de club</p>
          <p className="text-sm text-slate-500">Football amateur · bénévole depuis 12 ans</p>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Prêt à protéger votre club ?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Ouvrez votre espace club dès aujourd'hui. Vos adhérents méritent un canal
            sûr, votre bureau mérite un cadre clair.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-900/40 transition hover:from-blue-400 hover:to-blue-500"
            >
              Accéder à l'espace club
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-500">
            Compte de démonstration : admin@fc-etoile.fr / admin123
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-slate-900">ClubSafe</span>
          </div>
          <p className="text-sm text-slate-500">
            Outil de prévention des violences dans le sport amateur.
          </p>
          <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
            <Link href="/suivi" className="transition hover:text-slate-900">
              Suivre un dossier
            </Link>
            <Link href="/admin/login" className="transition hover:text-slate-900">
              Espace club
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}