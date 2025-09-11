

FROM node:22-bullseye

WORKDIR /app

COPY ./package.json ./

ENV AUTH0_M2M_AUDIENCE="http://kadernikplus908.io"
ENV AUTH0_ISSUER_BASE_URL="https://dev-vmu4oy0e2nc3n6l6.us.auth0.com/"
ENV AUTH0_M2M_CLIENT_ID="CCqEi1S2XNdIUr0efwCBcjkwYgutj3Sq"
# ENV DATABASE_URL="mysql://root:BGMPtqVUNHimbWymuAHWiefwqSQELZQG@maglev.proxy.rlwy.net:35588/railway"
ENV DATABASE_URL="${{ databáze.MYSQL_URL }}""
ENV SENTRY_AUTH_TOKEN="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"
ENV SENTRY_PROJECT = "node"
ENV SENTRY_ORG="kadernik"
ENV SENTRY_RELEASE = "default_release_tag_refactor"
ENV SENTRY_LOG_LEVEL=debug


RUN npm install

COPY . .

# COPY ./init.sh .

# RUN chmod +x ./init.sh

# RUN ./init.sh
RUN npx prisma generate
RUN npx prisma migrate deploy

RUN npm run build

CMD ["npm", "run" ,"start"]


