import { LogRepositoryPort } from "../../ports/log-repository";
import logRepositoryDb, {
  LogData,
  Logs,
} from "../../../infrastructure/data/prisma/prisma-log-repository";

const createGetAllLogsUseCase = (dependencies: {
  logRepositoryDb: LogRepositoryPort;
}) => {
  return {
    execute: async (userId: string): Promise<Logs[]> => {
      const logs = await dependencies.logRepositoryDb.getAllLogs(userId);
      // Map entityId: null to entityId: undefined to match LogData type
      return logs;
    },
  };
};

const getAllLogsUseCase = createGetAllLogsUseCase({
  logRepositoryDb,
});

export type GetAllLogsUseCaseType = ReturnType<typeof createGetAllLogsUseCase>;

export default getAllLogsUseCase;
