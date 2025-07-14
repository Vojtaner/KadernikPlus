#!/bin/sh

# Run migrations & generate Prisma client
echo "🧬 Running Prisma migrate and generate..."
npx prisma migrate dev --name init --skip-seed
npx prisma generate

# Start the server
echo "🚀 Starting server..."
npm run dev
