# Déploiement sur Portainer (GHCR)

Déploiement Docker de ClubSafe sur une stack Portainer, image publiée sur le
**GitHub Container Registry** (GHCR).

## Pipeline CI — publication de l'image

Le workflow `.github/workflows/docker-publish.yml` construit et pousse
automatiquement l'image sur `ghcr.io/marc78330/alerte` à chaque :

- push sur `main` → tag `main` (et `sha-XXXX`)
- tag Git `v*` → tags `v1.0.0`, etc.
- déclenchement manuel (onglet *Actions* → *Run workflow*)

> Le token `GITHUB_TOKEN` du workflow est utilisé : aucune configuration de
> secret nécessaire. Vérifiez dans les paramètres du package GHCR que sa
> visibilité est **privée** (valeur par défaut pour un repo privé).

## 1. Authentifier Portainer au registre GHCR

Pour un registre privé, créez un **Personal Access Token** GitHub avec la portée
`read:packages` :

1. GitHub → *Settings* → *Developer settings* → *Personal access tokens*
   → *Fine-grained* : sélectionnez votre repo `alerte` avec permission
   `Packages: Read`.
2. Portainer → *Registries* → *Add registry* → **GitHub Container Registry**
   - URL : `ghcr.io`
   - Username : votre nom GitHub (ex. `Marc78330`)
   - Password : le token créé ci-dessus
   - *Save*

## 2. Déployer la stack

1. Portainer → *Stacks* → *Add stack* → copiez le contenu de
   `docker-compose.yml`.
2. **Paramètres à personnaliser avant déploiement :**
   - `SESSION_SECRET` : générez une valeur aléatoire forte
     (`openssl rand -hex 32`) et conservez-la — toute perte invalide les
     sessions existantes.
   - `APP_URL` : l'URL publique de l'instance (ex. `https://clubsafe.example.fr`)
     — nécessaire pour le routage des domaines personnalisés de clubs.
   - `SEED_ON_START` : `true` pour la **première** installation (crée le club de
     démo, les 5 catégories, le compte admin et le super-admin), puis passez à
     `false`.
   - Le port `3000:3000` peut être adapté, ou remplacé par un reverse proxy
     (Traefik/Caddy) si souhaité.
3. *Deploy the stack*.

Les données sont persistées sur deux volumes nommés :
`clubsafe-data` (base SQLite) et `clubsafe-storage` (pièces jointes + logos).

## 3. Accès initiaux

| Rôle | Accès | Identifiants |
| --- | --- | --- |
| Bureau du club | `/admin/login` | `admin@fc-etoile.fr` / `admin123` |
| Super-admin plateforme | `/admin/login` | `superadmin@clubsafe.fr` / `admin123` |
| Signalement (QR vestiaire) | `/club/fc-etoile/signalement` | — |

> ⚠️ Changez ces mots de passe avant toute mise en production réelle.

## Notes techniques

- La base SQLite est créée/migrée automatiquement au démarrage (`prisma db push`).
- Aucun accès cloud : les fichiers restent dans `clubsafe-storage`.
- `DATABASE_URL` pointe sur `file:/data/clubsafe.db` (volume `clubsafe-data`).

## Mise à jour

Après un nouveau push sur `main`, dans la stack : *Stacks* → votre stack →
*Editor* → *Pull and redeploy* (ou *Update the stack*). L'image `:main` sera
re-téléchargée.

Pour suivre la version : *Containers* → votre conteneur → *Logs* (le démarrage
affiche le schéma appliqué et les seeds éventuels).