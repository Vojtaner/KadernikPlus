import { getEnvVar } from "../../../utils/getEnvVar";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getEnvVar("DATABASE_URL"),
    },
  },
});

export default prisma;
