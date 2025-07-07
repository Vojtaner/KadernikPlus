FROM node:23-bullseye-slim as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:23-bullseye-slim 
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
ENV PORT=8080
CMD ["serve", "-s", "dist", "-l", "8080"]