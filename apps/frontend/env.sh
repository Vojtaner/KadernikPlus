#!/usr/bin/env sh

# ================================================================================
# File: env.sh
# Description: Replaces env placeholders only in JS bundles and HTML, shows preview
# ================================================================================

set -e

: "${APP_PREFIX:?APP_PREFIX must be set (e.g. APP_PREFIX='PREFIX_')}"
: "${ASSET_DIR:?Must set ASSET_DIR to one path}"

if [ ! -d "$ASSET_DIR" ]; then
    echo "Warning: directory '$ASSET_DIR' not found, skipping."
    exit 0
fi

echo "Scanning directory: $ASSET_DIR for JS/HTML files"

env | grep "^${APP_PREFIX}" | while IFS='=' read -r key value; do
    echo "  • Replacing ${key} → ${value}"

    # Only process JS and HTML files
    find "$ASSET_DIR" -type f \( -name "*.js" -o -name "*.html" \) | while read file; do
        # Show first 50 characters containing placeholder (if present)
        if grep -q "$key" "$file"; then
            before=$(grep -o ".\{0,25\}$key.\{0,25\}" "$file" | head -n1)
            sed -i "s|${key}|${value}|g" "$file"
            after=$(grep -o ".\{0,25\}$value.\{0,25\}" "$file" | head -n1)
            echo "    $file"
            echo "      BEFORE: $before"
            echo "      AFTER:  $after"
        fi
    done
done

exec "$@"
