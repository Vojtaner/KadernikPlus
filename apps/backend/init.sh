#!/bin/sh

# Run migrations & generate Prisma client
echo "🧬 Running Prisma migrate and generate..."
# npx prisma migrate reset
npx prisma migrate dev --name init --skip-seed
npx prisma generate

# Start the server
echo "🚀 Starting server..."

#pro produkci musí být další dva řádky vypnuté/
# npm run dev
# npm run start

exec "$@"
