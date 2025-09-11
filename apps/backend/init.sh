# #!/bin/sh
# set -e

# # Load .env safely
# if [ -f .env ]; then
#   set -a           # export all variables
#   . ./.env         # source .env
#   set +a
# fi

# echo "🌍 Environment: $IS_DEVELOPMENT"

# if [ "$IS_DEVELOPMENT" = "true" ]; then
#     echo "🧬 Running Prisma migrate dev..."
#     npx prisma migrate dev --name init --skip-seed
# else
#     echo "🧬 Running Prisma migrate deploy..."
#     npx prisma migrate deploy
# fi

# npx prisma generate

# echo "🚀 Starting server..."
# npm run dev
# # npm run start

# exec "$@"