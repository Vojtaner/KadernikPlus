#!/usr/bin/env sh
# ================================================================================
# File: env.sh
# Description: Replaces environment variables in asset files and prints structure
# ================================================================================

set -e

# Hardcoded values
APP_PREFIX="PREFIX_"
ASSET_DIR="/usr/share/nginx/html"

# Check if the directory exists
if [ ! -d "$ASSET_DIR" ]; then
    echo "Warning: directory '$ASSET_DIR' not found, skipping."
    exit 0
fi

echo "Scanning directory: $ASSET_DIR"
echo "Folder structure:"
find "$ASSET_DIR" -type f

# Iterate through each environment variable that starts with APP_PREFIX
env | grep "^${APP_PREFIX}" | while IFS='=' read -r key value; do
    echo ""
    echo "Replacing ${key} → ${value}"

    # Replace in files and show 50 chars before/after match (for .js/.html)
    find "$ASSET_DIR" -type f \( -name "*.js" -o -name "*.html" \) | while read file; do
        # Show preview before replacement
        grep -o ".\{0,50\}${key}.\{0,50\}" "$file" | while read match; do
            echo "BEFORE: $match"
        done

        # Replace variable
        sed -i "s|${key}|${value}|g" "$file"

        # Show preview after replacement
        grep -o ".\{0,50\}${value}.\{0,50\}" "$file" | while read match; do
            echo "AFTER : $match"
        done
    done
done

exec "$@"
