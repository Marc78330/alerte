# ClubSafe 🛡️

Plateforme **100 % locale** de signalement des violences, harcèlements et discriminations dans les clubs sportifs amateurs, conforme aux obligations légales françaises (Art. 40 du CPP, cellule **Signal-Sports**).

Aucun service cloud : **SQLite + Prisma**, **Next.js (App Router, Server Actions)**, **TypeScript**, **Tailwind CSS**, **Lucide**, sessions signées par **cookie HTTP-only** (bcryptjs + WebCrypto HMAC-SHA256).

---

## Démarrage immédiat

```bash
npm install          # installe les dépendances (+ prisma generate)
npm run db:seed      # crée le club de démo, l'admin et 5 catégories
npm run dev          # http://localhost:3000
```

| Rôle | Accès |
| --- | --- |
| Adhérent / témoin | `http://localhost:3000/club/fc-etoile/signalement` (QR sur l'affiche) |
| Suivi anonyme | via le code `SAFE-XXXX-XXXX` remis après le signalement |
| Bureau du club | `http://localhost:3000/admin/login` — `admin@fc-etoile.fr` / `admin123` |

> En cas de changement de schéma : `npm run db:push` puis re-seed si nécessaire.

---

## Architecture

```
prisma/
  schema.prisma       Modèles Club, User, Report, ReportMessage, Attachment, AuditLog…
  seed.ts             Club FC Étoile Sportive + admin + 5 catégories
lib/
  prisma.ts           Client Prisma singleton
  session.ts          Cookie de session signé (Edge + Node), base64url + HMAC
  tokens.ts           Jeton de suivi lisible  SAFE-XXXX-XXXX avec caractère de contrôle
  validation.ts       Schémas Zod (Zod = validation de chaque Server Action)
  constants.ts        Statuts, sévérités, SLA 7 jours, références légales
  storage.ts          Upload hors dossier public  →  ./storage/vault/
  legal.ts            Assistant juridique contextuel (niveaux 1/2/3)
  auth.ts             Guard serveur des pages admin
app/
  club/[slug]/signalement      Formulaire public pas-à-pas (4 étapes)
  suivi/[token]                Espace de suivi anonyme + messagerie chiffrée
  admin/login                  Connexion cookie session
  admin/dashboard              Liste des dossiers + alertes SLA
  admin/report/[id]            Détail, chat, audit, module d'assistance légale
  admin/parametres             Charte graphique, catégories, emails d'alerte
  admin/affiche                Affiche A4 imprimable + QR code vectoriel
  api/files/[id]               Servi uniquement si cookie admin valide OU token du signalement
  api/admin/templates/[type]   Modèles téléchargeables (saisine, mesure, fiche entretien)
middleware.ts                  Protège /admin/* (vérification de session HMAC)
```

---

## Parcours métier

1. **Signalement** — l'adhérent scanne le QR (vestiaire) : anonymat absolu ou identité
   confidentielle → qualification des faits (catégories activées par le club, victime
   mineure ?) → récit (Où / Quand / Quoi) + pièces jointes locales → affichage du code
   `SAFE-XXXX-XXXX`.
2. **Suivi** — sans compte, un jeton suffit : frise chronologique
   (Prise en compte → En instruction → Mesures prises → Clôturé) et messagerie
   bidirectionnelle sans rupture d'anonymat.
3. **Bureau** — chaque dossier porte une gravité (1 à 3) et un SLA (accusé de réception
   sous 7 jours), avec historique d'audit horodaté.
4. **Assistant juridique** selon la gravité :
   - Niveau 1 → protocole de médiation + fiche d'entretien téléchargeable.
   - Niveau 2 → notification type de mesure conservatoire.
   - Niveau 3 (ou victime mineure) → alerte rouge : coordonnées **Signal-Sports**
     (0 800 05 95 95) + modèle pré-rempli de saisine du **Procureur** (Art. 40 al. 2 CPP).

---

## Sécurité

- Mots de passe hashés **bcryptjs** (12 rounds) ; session signée HMAC-SHA256, cookie
  `httpOnly`, `sameSite=lax`.
- `SESSION_SECRET` dans `.env` (à changer hors dev).
- Pièces jointes écrites sous `./storage/vault/` (hors `public/`), nommées de façon
  opaque, servies uniquement : cookie admin du même club **ou** token du signalement.
- Validation **Zod** sur chaque Server Action ; limitation taille (15 Mo) et nombre (5).
- Vérification anti-fraude du jeton de suivi (caractère de contrôle).

## Commandes utiles

```bash
npm run typecheck   # tsc --noEmit
npm run build       # prisma generate + production build
npm run start       # serveur de production
npm run db:studio   # explorateur Prisma
npx prisma db push  # applique le schéma
```

## Avertissement légal

Outil d'aide à la décision des clubs amateurs. Il ne remplace pas un avis d'avocat ni
les obligations propres à votre fédération. En cas de danger immédiat, appelez le **17**.