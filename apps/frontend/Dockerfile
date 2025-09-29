# ===== STAGE 1: Build =====
FROM node:23-bullseye-slim AS build
WORKDIR /app

# Install dependencies
COPY ./package*.json ./
RUN npm install

# Copy source
COPY . .

# Build the frontend (placeholders remain)
RUN npm run build

# ===== STAGE 2: Nginx + env.sh =====
FROM nginx:alpine
WORKDIR /app

# Install tools
RUN apk add --no-cache bash dos2unix

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy env.sh and make it executable
COPY env.sh /env.sh
RUN dos2unix /env.sh && chmod +x /env.sh

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set ASSET_DIR and APP_PREFIX only — actual variables come from Railway
# ENV ASSET_DIR="/usr/share/nginx/html"
# ENV APP_PREFIX="PREFIX_"

# Debug: print environment variables (optional)
# ENTRYPOINT ["/bin/sh", "-c", "env; /env.sh; exec nginx -g 'daemon off;'"]

# Run env.sh at container start, then start Nginx
ENTRYPOINT ["/bin/sh", "-c", "/env.sh && exec nginx -g 'daemon off;'"]

# Expose port
EXPOSE 8083
