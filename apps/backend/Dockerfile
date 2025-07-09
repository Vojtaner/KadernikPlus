FROM node:22-bullseye

WORKDIR /backend

COPY backend/package.json ./

RUN npm install

COPY backend/ .

COPY entities/ ../entities/

RUN npm run prisma:generate

RUN npm run prisma:migrate

RUN npm run build

# CMD ["sh", "-c", "echo Running migrations... && npx prisma migrate deploy && echo Starting server... && npm run start:deploy"]
CMD ["npm", "run" ,"start"]