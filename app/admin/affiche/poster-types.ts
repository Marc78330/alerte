export const POSTER_STYLES = [
  {
    id: "SPORT",
    label: "Sport",
    tagline: "Titres condensés, énergie, rubans",
    swatch: "from-blue-600 to-slate-900",
    emoji: "🏃",
  },
  {
    id: "CLASSIC",
    label: "Classique",
    tagline: "Sobre, institutionnel, très lisible",
    swatch: "from-slate-700 to-slate-900",
    emoji: "🛡️",
  },
  {
    id: "JEUNE",
    label: "Jeune",
    tagline: "Vif, pastilles colorées, famille",
    swatch: "from-pink-500 to-orange-400",
    emoji: "🧃",
  },
  {
    id: "MINIMAL",
    label: "Minimal",
    tagline: "Beaucoup d'air, élégant, centré",
    swatch: "from-slate-200 to-slate-400",
    emoji: "◽",
  },
  {
    id: "STREET",
    label: "Street",
    tagline: "Urban, tags, bande jaune, énergie",
    swatch: "from-yellow-400 to-slate-900",
    emoji: "🎨",
  },
  {
    id: "NEON",
    label: "Néon",
    tagline: "Nuit, glow, néon holographique",
    swatch: "from-black via-slate-900 to-blue-600",
    emoji: "🌃",
  },
  {
    id: "Y2K",
    label: "Y2K",
    tagline: "Années 2000, gloss, couleurs pop",
    swatch: "from-pink-400 via-fuchsia-500 to-cyan-400",
    emoji: "💿",
  },
  {
    id: "EDITO",
    label: "Éditorial",
    tagline: "Magazine, typo géante, mise en pages",
    swatch: "from-zinc-800 to-zinc-950",
    emoji: "🗞️",
  },
] as const;

export type PosterStyleId = (typeof POSTER_STYLES)[number]["id"];

export type PosterVariantProps = {
  clubName: string;
  sport: string;
  primaryColor: string;
  trackingUrl: string;
  logoSrc: string | null;
  qrDataUrl: string;
};