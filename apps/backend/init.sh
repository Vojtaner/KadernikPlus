#!/bin/sh
set -e

echo "🌍 Environment: $NODE_ENV"

if [ "$NODE_ENV" = "production" ]; then
  echo "🧬 Running Prisma migrate deploy..."
  npx prisma migrate deploy
else
  echo "🧬 Running Prisma migrate dev..."
  npx prisma migrate dev --name init --skip-seed
fi

npx prisma generate

echo "🚀 Starting server..."

exec "$@"