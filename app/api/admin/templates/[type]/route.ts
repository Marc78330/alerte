import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";

const CONTENT = {
  "saisine-procureur": {
    filename: "saisine-procureur-art40.txt",
    body: `OBJET : Signalement au Procureur de la République — Article 40 du Code de procédure pénale

Madame, Monsieur le Procureur de la République,

Je soussigné(e) [NOM Prénom], agissant en qualité de [fonction] du club [NOM DU CLUB],
porte à votre connaissance, conformément aux dispositions de l'article 40 alinéa 2
du Code de procédure pénale, les faits suivants dont j'ai connaissance dans
l'exercice de mes fonctions :

1. DESCRIPTION DES FAITS
   [Décrire factuellement et chronologiquement les faits signalés.]

2. DATE ET LIEU DES FAITS
   [Date(s) et lieu(x) des faits.]

3. IDENTITE DE LA VICTIME
   [Nom, prénom, date de naissance].  [PRECISION : victime mineure OUI / NON]

4. IDENTITE DE LA PERSONNE MISE EN CAUSE
   [Nom, prénom, qualité ou à défaut « identité non confirmée à ce stade ».]

5. TEMOINS ET ELEMENTS MATERIELS
   [Témoins éventuels, pièces jointes transmises.]

6. MESURES DEJA PRISES PAR LE CLUB
   [Mesures conservatoires éventuelles, mise à pied, etc.]

Les éléments du dossier (récits, pièces jointes) sont tenus à votre disposition.
Je reste à votre entière disposition pour tout complément d'information.

Fait à [VILLE], le [DATE]

Signature :
[Prénom NOM]
[Qualité]
[Club]
[Coordonnées]
`,
  },
  "mesure-conservatoire": {
    filename: "mesure-conservatoire-notification.txt",
    body: `OBJET : Notification d'une mesure conservatoire — suspension immédiate de l'activité

Madame, Monsieur [NOM Prénom],

Siégeant à [DATE], le bureau du [NOM DU CLUB] a été destinataire d'éléments graves et
circonstanciés relatifs à des faits susceptibles de caractériser [NATURE DES FAITS].

Conformément aux dispositions du règlement intérieur et dans un souci de protection
des pratiquants, il a été décidé de vous notifier les mesures conservatoires suivantes :
une suspension immédiate et à titre conservatoire de toute fonction ou activité au
sein de la structure, pour une durée initiale de [X] jours.

Cette mesure ne constitue pas une sanction disciplinaire. Une enquête interne est en
cours et vous serez entendu(e) préalablement à toute décision définitive.

Cette notification vous est adressée de manière contradictoire. Vous disposez d'un
délai de [X] jours pour présenter vos observations au bureau.

Fait à [VILLE], le [DATE]

Le Président : [Signature]
`,
  },
  "fiche-entretien": {
    filename: "fiche-entretien-mediation.txt",
    body: `FICHE D'ENTRETIEN — PROTOCOLE DE MÉDIATION INTERNE

Club : [NOM DU CLUB]
Référence du dossier : [NUMERO]
Date de l'entretien : [DATE]
Heure : [HEURE]
Lieu : [LIEU]

Intervenants :
- Éducateur/encadrant concerné : [NOM]
- Membre(s) du bureau présent(s) : [NOMS]
- Autre(s) personne(s) : [NOMS]

Objet de la médiation :
[Description concise de l'objet de l'entretien et des faits discutés.]

1. PROPOS TENUS LORS DE L'ENTRETIEN
   [Synthèse des échanges.]

2. POINTS D'ACCORD
   [Points sur lesquels les parties s'engagent.]

3. ENGAGEMENTS PRIS
   [Engagements concrets de l'encadrant/adherent et délais.]

4. SUIVI
   [Modalités de contrôle de l'évolution de la situation et nouvel entretien prévu le [DATE].]

Signatures : [Président]    [Personne concernée]

Mention : Document confidentiel — protégé par le secret des délibérations du bureau.
`,
  },
} as const;

export type TemplateType = keyof typeof CONTENT;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const template = CONTENT[type as TemplateType];
  if (!template) {
    return new NextResponse("Type de modèle inconnu.", { status: 404 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return new NextResponse("Non autorisé.", { status: 401 });
  }

  return new NextResponse(template.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${template.filename}"`,
    },
  });
}