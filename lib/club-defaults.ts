export const DEFAULT_CATEGORIES = [
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
] as const;