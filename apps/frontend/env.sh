#!/usr/bin/env sh
# Minimal env replacement script

set -e

APP_PREFIX="PREFIX_"
ASSET_DIR="/usr/share/nginx/html"

# Exit if asset directory does not exist
[ -d "$ASSET_DIR" ] || exit 0

# Iterate over environment variables starting with APP_PREFIX
env | grep "^${APP_PREFIX}" | while IFS='=' read -r key value; do
    find "$ASSET_DIR" -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i "s|${key}|${value}|g" {} +
done

exec "$@"
