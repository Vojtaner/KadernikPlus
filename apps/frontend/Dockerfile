# ===== STAGE 1: Build =====
FROM node:23-bullseye-slim AS build
WORKDIR /app

# ARG VITE_ENABLE_MOCKS
# ARG VITE_IS_DEVELOPMENT
# ARG VITE_PORT
# ARG VITE_API_URL

# ENV PREFIX_ENABLE_MOCKS=false
# ENV PREFIX_IS_DEVELOPMENT=false
# ENV PREFIX_PORT=3021
# ENV PREFIX_API_URL=http://localhost:3021
# ENV APP_PREFIX=PREFIX_
# ENV PREFIX_AUT0_DOMAIN=dev-ri7i8tb9.us.auth0.com
# ENV PREFIX_AUT0_DOMAIN=IXBSMrmYutHAC8gNTXg1hCyavwnEczbo

# ENV VITE_ENABLE_MOCKS=$VITE_ENABLE_MOCKS
# ENV VITE_IS_DEVELOPMENT=$VITE_IS_DEVELOPMENT
# ENV VITE_PORT=$VITE_PORT
# ENV VITE_API_URL=$VITE_API_URL



COPY ./package*.json ./

RUN npm install

ENV APP_PREFIX=PREFIX_
ENV ASSET_DIR=/app/dist

COPY . .

RUN npm run build


FROM node:23-bullseye-slim
WORKDIR /app

RUN apt-get update && apt-get install -y dos2unix

COPY --from=build /app/dist ./dist
COPY env.sh /env.sh

RUN dos2unix /env.sh && chmod +x /env.sh

RUN npm install -g serve

ENV PORT=8083
ENV APP_PREFIX=PREFIX_
ENV ASSET_DIR=/app/dist

ENTRYPOINT ["/env.sh"]

CMD ["serve", "-s", "dist", "-l", "8083"]

