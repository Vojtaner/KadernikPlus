#!/usr/bin/env sh

# ================================================================================
# File: env.sh
# Description: Replaces environment variables in asset files.
# ================================================================================

set -e

: "${APP_PREFIX:?APP_PREFIX must be set (e.g. APP_PREFIX='PREFIX_')}"
: "${ASSET_DIR:?Must set ASSET_DIR to one path}"

if [ ! -d "$ASSET_DIR" ]; then
    echo "Warning: directory '$ASSET_DIR' not found, skipping."
    exit 0
fi

echo "Scanning directory: $ASSET_DIR"

# Replace all PREFIX_ variables
env | grep "^${APP_PREFIX}" | while IFS='=' read -r key value; do
    echo "  • Replacing ${key} → ${value}"
    find "$ASSET_DIR" -type f -exec sed -i "s|${key}|${value}|g" {} +
done

echo "==== DEBUG: checking replaced bundle ===="
# Najdi první JS soubor a ukaž prvních 60 řádků
first_js=$(find "$ASSET_DIR" -name "index*.js" | head -n 1 || true)
if [ -n "$first_js" ]; then
    echo "Preview of $first_js:"
    head -n 60 "$first_js"
else
    echo "No index*.js found in $ASSET_DIR"
fi
echo "==== END DEBUG ===="

exec "$@"
