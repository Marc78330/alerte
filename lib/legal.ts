/** Assistance juridique contextuelle selon la gravité du signalement. */
export function getLegalGuidance(severityLevel: number, isMinorVictim: boolean) {
  const escalate = severityLevel === 3 || isMinorVictim;
  if (escalate) {
    return {
      level: 3 as const,
      label: "ALERTE ROUGE — Signalement obligatoire Art. 40 CPP",
      message:
        "En raison de la gravité des faits signalés et/ou du fait que la victime soit mineure, vous êtes légalement tenu(e) de saisir le Procureur de la République sous 48 heures.",
      actions: [
        "Conserver l'intégralité du dossier et des pièces jointes.",
        "Établir un procès-verbal circonstancié.",
        "Transmettre la saisine au Procureur (modèle disponible ci-dessous).",
        "Signaler le signalement à la cellule Signal-Sports du Ministère des Sports.",
      ],
      procureurTemplate: true,
      signalSports: true,
    };
  }
  if (severityLevel === 2) {
    return {
      level: 2 as const,
      label: "MESURES CONSERVATOIRES RECOMMANDÉES",
      message:
        "En raison du caractère grave des faits, il est recommandé de prendre immédiatement une mesure conservatoire (mise à pied, suspension de l'activité de l'éducateur ou du licencié concerné) dans l'attente de l'instruction.",
      actions: [
        "Notifier par écrit la mesure à l'intéressé en mentionnant les motifs.",
        "Conserver tous les éléments de preuve (témoignages, messages, etc.).",
        "Entamer une enquête interne.",
      ],
      procureurTemplate: false,
      signalSports: false,
    };
  }
  return {
    level: 1 as const,
    label: "PROTOCOLE DE MÉDIATION — niveau 1",
    message:
      "Les faits signalés apparaissent d'importance modérée. Envisagez dans un premier temps un échange de médiation ou un entretien formel avec les parties concernées.",
    actions: [
      "Convocation écrite de l'intéressé pour un entretien préalable.",
      "Rédaction d'une fiche d'entretien (téléchargeable).",
      "Suivi des engagements pris lors de l'entretien.",
    ],
    procureurTemplate: false,
    signalSports: false,
  };
}