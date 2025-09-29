#!/usr/bin/env sh

# ================================================================================
# File: env.sh
# Description: Replaces environment variables in asset files.
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

# Iterate through each environment variable that starts with APP_PREFIX
env | grep "^${APP_PREFIX}" | while IFS='=' read -r key value; do
    echo "  • Replacing ${key} → ${value}"

    # Replace in files
    find "$ASSET_DIR" -type f \
        -exec sed -i "s|${key}|${value}|g" {} +
done

exec "$@"
