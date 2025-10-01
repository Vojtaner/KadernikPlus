#!/usr/bin/env bash
set -euo pipefail

# ================================================================================
# File: cleanupSchemas.sh
# Description: Drop one or more schemas in a Railway MySQL service safely.
# Usage: ./cleanupSchemas.sh pr-37 pr-38 old-feature
# ================================================================================

# -----------------------------
# CONFIGURATION
# -----------------------------
# Project ID and Service ID can be set via CLI args or hardcoded
PROJECT_ID="${PROJECT_ID:-}"
SERVICE_ID="${SERVICE_ID:-}"

if [[ -z "$PROJECT_ID" || -z "$SERVICE_ID" ]]; then
  echo "You must set PROJECT_ID and SERVICE_ID environment variables."
  echo "Example: export PROJECT_ID=abc123"
  echo "         export SERVICE_ID=def456"
  exit 1
fi

# -----------------------------
# LINK RAILWAY SERVICE
# -----------------------------
echo "Linking to Railway service..."
npx railway link --project "$PROJECT_ID" --service "$SERVICE_ID" --environment staging

# -----------------------------
# RETRIEVE DATABASE VARIABLES
# -----------------------------
DB_USER=$(npx railway variables --json | jq -r '.MYSQLUSER')
DB_PASS=$(npx railway variables --json | jq -r '.MYSQLPASSWORD')
DB_HOST=$(npx railway variables --json | jq -r '.RAILWAY_TCP_PROXY_DOMAIN')
DB_PORT=$(npx railway variables --json | jq -r '.RAILWAY_TCP_PROXY_PORT')

echo "Connected to MySQL service at $DB_HOST:$DB_PORT as $DB_USER"

# -----------------------------
# SAFETY CHECK: prevent accidental production drops
# -----------------------------
readonly PRODUCTION_SCHEMAS=("main" "production" "staging")
for schema in "$@"; do
    for prod in "${PRODUCTION_SCHEMAS[@]}"; do
        if [[ "$schema" == "$prod" ]]; then
            echo "Error: Attempted to drop protected schema '$schema'. Aborting."
            exit 1
        fi
    done
done

# -----------------------------
# DROP SCHEMAS
# -----------------------------
for SCHEMA in "$@"; do
    echo "Dropping schema: $SCHEMA"
    read -p "Confirm drop of schema '$SCHEMA'? [y/N] " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo "Skipping $SCHEMA"
        continue
    fi

    mysql -u "$DB_USER" -p"$DB_PASS" -h "$DB_HOST" -P "$DB_PORT" -e "DROP DATABASE IF EXISTS \`$SCHEMA\`;"
    echo "Schema '$SCHEMA' dropped successfully."
done

echo "All done!"

