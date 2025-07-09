# ===== STAGE 1: Build =====
FROM node:23-bullseye-slim as build
WORKDIR ./app

COPY ./frontend/package*.json ./
RUN npm install

COPY ./frontend .
RUN npm run build

# ===== STAGE 2: Serve =====
FROM node:23-bullseye-slim
WORKDIR /app
RUN npm install -g serve

COPY --from=build /app/dist ./dist

ENV PORT=8089
EXPOSE 8089

# Use host port 3000 or whatever you prefer
CMD ["serve", "-s", "dist", "-l", "8089"]
