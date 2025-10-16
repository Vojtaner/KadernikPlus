import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "./prisma";

export type LogData = {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  message: string;
  metadata: any;
  teamId: string;
};

export type Logs = Prisma.LogEntryGetPayload<{
  include: {
    user: true;
  };
}>;

const createLogRepository = (prisma: PrismaClient) => {
  return {
    log: async (logData: LogData): Promise<void> => {
      await prisma.logEntry.create({ data: logData });
    },
    getAllLogs: async (userId: string): Promise<Logs[]> => {
      const teamMember = await prisma.teamMember.findUnique({
        where: { userId },
      });

      const logs = await prisma.logEntry.findMany({
        where: { OR: [{ teamId: teamMember?.teamId }, { userId }] },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });

      return logs;
    },
  };
};

const logRepositoryDb = createLogRepository(prisma);

export default logRepositoryDb;
