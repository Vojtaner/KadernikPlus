#!/usr/bin/env sh

set -e

APP_PREFIX="PREFIX_"
ASSET_DIR="/usr/share/nginx/html"

[ -d "$ASSET_DIR" ] || exit 0

env | grep "^${APP_PREFIX}" | while IFS='=' read -r key value; do
    find "$ASSET_DIR" -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i "s|${key}|${value}|g" {} +
done

exec "$@"
