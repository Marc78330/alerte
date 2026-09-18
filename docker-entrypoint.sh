#!/bin/sh
set -e

echo "⏳ Application du schéma de base de données..."
npx prisma db push --skip-generate

if [ "$SEED_ON_START" = "true" ]; then
  echo "🌱 Seed des données de démonstration..."
  npx tsx prisma/seed.ts
fi

echo "🚀 Démarrage de ClubSafe sur le port ${PORT:-3000}..."
exec node node_modules/next/dist/bin/next start -p "${PORT:-3000}"