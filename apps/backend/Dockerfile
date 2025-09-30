

FROM node:22-bullseye

WORKDIR /app

COPY ./package.json ./

# ENV AUTH0_M2M_AUDIENCE="http://kadernikplus908.io"
# ENV AUTH0_ISSUER_BASE_URL="https://dev-vmu4oy0e2nc3n6l6.us.auth0.com/"
# ENV AUTH0_M2M_CLIENT_ID="CCqEi1S2XNdIUr0efwCBcjkwYgutj3Sq"
# ENV SENTRY_AUTH_TOKEN="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"
# ENV SENTRY_PROJECT = "node"
# ENV SENTRY_ORG="kadernik"
# ENV SENTRY_RELEASE = "default_release_tag_refactor"
# ENV SENTRY_LOG_LEVEL=debug


ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}


RUN npm install

COPY . .

CMD ["sh", "-c", "npx prisma generate && node setup-db.js"]

RUN npm run build




# REMOVE this:
#  RUN npx prisma generate
# Instead, run at container startup