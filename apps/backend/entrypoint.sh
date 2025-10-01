#!/usr/bin/env sh
set -e

echo "--------------------------------------"
echo "Starting entrypoint.sh"
echo "RAILWAY_GIT_BRANCH: $RAILWAY_GIT_BRANCH"
echo "DATABASE_URL_BASE: $DATABASE_URL_BASE"

# Sestavíme finální DATABASE_URL
export DATABASE_URL="${DATABASE_URL_BASE}/${RAILWAY_GIT_BRANCH}"

echo "Resolved DATABASE_URL: $DATABASE_URL"
echo "--------------------------------------"
env | grep DATABASE_URL
# Spustíme aplikaci
exec npm run start