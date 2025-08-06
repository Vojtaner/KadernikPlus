

FROM node:22-bullseye

WORKDIR /app

COPY ./package.json ./

ENV AUDIENCE="http://kadernikplus908.io"
ENV AUTH0_M2M_AUDIENCE="http://kadernikplus908.io"
ENV AUTH0_M2M_CLIENT_ID="lftK2U2vymoAhbDpexRfSorBiMX8mk4G"
ENV AUTH0_M2M_CLIENT_SECRET="yk01Wq2clYsMh3ZqJYfnxczWBCvFRyx7uao1trOV4oxnnbebWqc0avtBaVJ9-4-S"
ENV AUTH0_M2M_DOMAIN="https://dev-ri7i8tb9.us.auth0.com/api/v2/"
ENV AUTH0_TOKE_SIGNING_ALG="RS256"
ENV DATABASE_URL="mysql://root:MWnDsLipQFXbPNMAirgLxmIHNFvpDtlR@shuttle.proxy.rlwy.net:49824/railway"
ENV PORT="3021"

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