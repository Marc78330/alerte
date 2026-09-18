export const formatters = {
  dateTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  },

  timelineFor(status: string): string[] {
    return [
      "Prise en compte",
      "En instruction",
      "Mesures prises",
      "Clôturé",
    ];
  },

  statusIndex(status: string): number {
    switch (status) {
      case "NOUVEAU":
        return 0;
      case "EN_COURS":
        return 1;
      case "TRANSMIS_AUTORITES":
        return 2;
      case "RESOLU":
        return 3;
      default:
        return 0;
    }
  },
};