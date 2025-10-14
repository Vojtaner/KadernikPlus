FROM node:22-bullseye

WORKDIR /app

COPY ./package.json ./

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

RUN npm install

COPY . .

RUN DATABASE_URL="mysql://user:pass@localhost:3306/fake" npx prisma generate

RUN npm run build

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
