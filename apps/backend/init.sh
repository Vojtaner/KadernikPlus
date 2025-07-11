#!/bin/sh

# Run migrations & generate Prisma client
echo "🧬 Running Prisma migrate and generate..."
npx prisma migrate dev --name init --skip-seed
npx prisma generate

## Testing successful migration
echo "🔍 Verifying database contents..."
docker exec mysql-db-hairdresser mysql -u root -pmy_secret_password -e "
USE my_app_db;
SHOW TABLES;
SELECT * FROM users;
"

# Start the server
echo "🚀 Starting server..."
npm run dev
