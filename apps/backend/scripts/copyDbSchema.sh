#!/usr/bin/env bash
set -e

# === CONFIG ===
PROJECT_ID="tvuj_project_id"
SERVICE_ID="tvuj_mysql_service_id"

SOURCE_ENV="production"
TARGET_ENV="production"       # nebo PR branch jméno

SOURCE_DB_NAME="kadernikplus"      # produkční schéma
TARGET_DB_NAME="main"

DUMP_FILE="prod_dump.sql"

# === Link na službu MySQL ===
npx railway link --project "$PROJECT_ID" --service "$SERVICE_ID"

echo "Fetching source DB variables ($SOURCE_ENV)..."
SRC_USER=$(npx railway variables --environment "$SOURCE_ENV" --json | jq -r '.MYSQLUSER')
SRC_PASS=$(npx railway variables --environment "$SOURCE_ENV" --json | jq -r '.MYSQLPASSWORD')
SRC_HOST=$(npx railway variables --environment "$SOURCE_ENV" --json | jq -r '.RAILWAY_TCP_PROXY_DOMAIN')
SRC_PORT=$(npx railway variables --environment "$SOURCE_ENV" --json | jq -r '.RAILWAY_TCP_PROXY_PORT')


echo "Fetching target DB variables ($TARGET_ENV)..."
TGT_USER=$(npx railway variables --environment "$TARGET_ENV" --json | jq -r '.MYSQLUSER')
TGT_PASS=$(npx railway variables --environment "$TARGET_ENV" --json | jq -r '.MYSQLPASSWORD')
TGT_HOST=$(npx railway variables --environment "$TARGET_ENV" --json | jq -r '.RAILWAY_TCP_PROXY_DOMAIN')
TGT_PORT=$(npx railway variables --environment "$TARGET_ENV" --json | jq -r '.RAILWAY_TCP_PROXY_PORT')

# === Dump produkční DB ===
echo "Exporting source DB ($SOURCE_DB_NAME)..."
mysqldump -u "$SRC_USER" -p"$SRC_PASS" -h "$SRC_HOST" -P "$SRC_PORT" "$SOURCE_DB_NAME" > "$DUMP_FILE"

# === Vytvoření schématu v cílové DB ===
echo "Creating target DB ($TARGET_DB_NAME)..."
mysql -u "$TGT_USER" -p"$TGT_PASS" -h "$TGT_HOST" -P "$TGT_PORT" -e "CREATE DATABASE IF NOT EXISTS \`$TARGET_DB_NAME\`;"

# === Import dumpu do cílové DB ===
echo "Importing dump into $TARGET_DB_NAME..."
mysql -u "$TGT_USER" -p"$TGT_PASS" -h "$TGT_HOST" -P "$TGT_PORT" "$TARGET_DB_NAME" < "$DUMP_FILE"

echo "✅ Database copied from $SOURCE_ENV to $TARGET_ENV/$TARGET_DB_NAME"
