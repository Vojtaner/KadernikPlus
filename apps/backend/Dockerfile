

FROM node:22-bullseye

WORKDIR /app

COPY ./package.json ./

ENV AUTH0_M2M_AUDIENCE="http://kadernikplus908.io"
ENV AUTH0_ISSUER_BASE_URL="https://dev-vmu4oy0e2nc3n6l6.us.auth0.com/"
ENV AUTH0_M2M_CLIENT_ID="CCqEi1S2XNdIUr0efwCBcjkwYgutj3Sq"
ENV DATABASE_URL="mysql://root:BGMPtqVUNHimbWymuAHWiefwqSQELZQG@maglev.proxy.rlwy.net:35588/railway"

RUN npm install

COPY . .

COPY ./init.sh .

RUN chmod +x ./init.sh

RUN ./init.sh

# running init.sh file to make 
    # 1. grant priviledges to database 
    # 2. prisma migrate, 
    # 3. prisma generate

RUN npm run build

CMD ["npm", "run" ,"start"]


