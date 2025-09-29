# ===== STAGE 1: Build =====
FROM node:23-bullseye-slim AS build
WORKDIR /app

COPY ./package*.json ./

RUN npm install


# ENV APP_PREFIX="PREFIX_"
# ENV ASSET_DIR=/app/dist

COPY . .

RUN npm run build



# ===== STAGE 2: Final image with Nginx & env.sh =====
FROM nginx:alpine

WORKDIR /app
# Nainstaluj bash, dos2unix
RUN apk add --no-cache bash dos2unix


# Přenes dist výstup z build fáze
COPY --from=build /app/dist /usr/share/nginx/html

# Přenes env.sh a připrav ho ke spuštění
COPY env.sh /env.sh
RUN dos2unix /env.sh && chmod +x /env.sh

# Přenes vlastní Nginx konfiguraci (přes port 8083)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Environment proměnné
ENV PORT=8083
ENV APP_PREFIX="PREFIX_"
ENV ASSET_DIR="/usr/share/nginx/html"

# Spustí env.sh před nginxem
ENTRYPOINT ["/env.sh"]

# Standardní příkaz pro Nginx
CMD ["nginx", "-g", "daemon off;"]


# spuštění
# docker run -p 3004:80 \
#   -e PREFIX_API_URL=http://localhost:3021  \
#   -e PREFIX_PORT=80 \
#   -e PREFIX_ENABLE_MOCKS=false \
#   -e PREFIX_IS_DEVELOPMENT=false \
#   -e PREFIX_AUT0_DOMAIN=dev-ri7i8tb9.us.auth0.com \
#   -e PREFIX_AUT0_CLIENT_ID=IXBSMrmYutHAC8gNTXg1hCyavwnEczbo\
#   -e PREFIX_AUT0_AUDIENCE=http://localhost:3021\
#   my-nginx


