#!/usr/bin/env sh

# ================================================================================
# File: env.sh
# Description: Replaces environment variables in asset files and previews first 50 chars
# ================================================================================

set -e

: "${APP_PREFIX:?APP_PREFIX must be set (e.g. APP_PREFIX='PREFIX_')}"
: "${ASSET_DIR:?Must set ASSET_DIR to one path}"

if [ ! -d "$ASSET_DIR" ]; then
    echo "Warning: directory '$ASSET_DIR' not found, skipping."
    exit 0
fi

echo "Scanning directory: $ASSET_DIR"

env | grep "^${APP_PREFIX}" | while IFS='=' read -r key value; do
    echo "  • Replacing ${key} → ${value}"

    # Iterate over files
    find "$ASSET_DIR" -type f | while read file; do
        # Show first 50 chars before replacement
        before=$(head -c 50 "$file")
        echo "    BEFORE: ${before}"

        # Replace the placeholder
        sed -i "s|${key}|${value}|g" "$file"

        # Show first 50 chars after replacement
        after=$(head -c 50 "$file")
        echo "    AFTER:  ${after}"
    done
done

exec "$@"
