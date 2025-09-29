# ===== STAGE 1: Build =====
FROM node:23-bullseye-slim AS build
WORKDIR /app

# Install dependencies
COPY ./package*.json ./
RUN npm install

COPY . .

RUN npm run build

# ===== STAGE 2: Nginx + env.sh =====
FROM nginx:alpine
WORKDIR /app

RUN apk add --no-cache bash dos2unix

COPY --from=build /app/dist /usr/share/nginx/html

COPY env.sh /env.sh
RUN dos2unix /env.sh && chmod +x /env.sh

COPY nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["/bin/sh", "-c", "/env.sh && exec nginx -g 'daemon off;'"]

