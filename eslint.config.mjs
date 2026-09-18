import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const config = defineConfig([
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts"]),
  ...nextVitals,
  {
    rules: {
      // Texte français : on autorise l'apostrophe simple et la droite dans le JSX.
      "react/no-unescaped-entities": [
        "error",
        { forbid: [">", '"', "}", "`"] },
      ],
      // Règle expérimentale React Compiler : trop bavarde pour du rendu
      // affichant l'heure courante (décomptes SLA…) volontairement non purs.
      "react-hooks/purity": "off",
    },
  },
]);

export default config;