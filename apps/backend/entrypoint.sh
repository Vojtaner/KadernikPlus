#!/bin/sh
set -e

# Sestavíme runtime databázovou URL
export DATABASE_URL="${DATABASE_URL_BASE}/${RAILWAY_GIT_BRANCH}"

echo "Using DATABASE_URL=$DATABASE_URL"

# Spustíme migrace (volitelné, pokud chceš i při startu)
# npx prisma migrate deploy

# Spustíme aplikaci
exec npm run start
