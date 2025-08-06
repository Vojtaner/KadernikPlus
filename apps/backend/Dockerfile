

FROM node:22-bullseye

WORKDIR /app

COPY ./package.json ./

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