import {
  LogData,
  Logs,
} from "../../infrastructure/data/prisma/prisma-log-repository";

export type LogRepositoryPort = {
  log: (data: LogData) => Promise<void>;
  getAllLogs: (userId: string) => Promise<Logs[]>;
};
