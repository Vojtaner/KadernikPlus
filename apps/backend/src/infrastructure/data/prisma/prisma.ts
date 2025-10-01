import { getEnvVar } from "../../../utils/getEnvVar";
import { PrismaClient } from "@prisma/client";

const databaseUrl = `${getEnvVar("DATABASE_URL_BASE")}/${
  process.env.RAILWAY_GIT_BRANCH
}`;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma;
