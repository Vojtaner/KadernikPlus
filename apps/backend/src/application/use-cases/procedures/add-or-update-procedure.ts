import {
  ProcedureCreateData,
  ProcedureRepositoryPort,
} from "../../../application/ports/procedure-repository";
import procedureRepositoryDb from "../../../infrastructure/data/prisma/prisma-procedure-repository";
import { Procedure } from ".prisma/client";
import { LogRepositoryPort } from "../../../application/ports/log-repository";
import logRepositoryDb from "../../../infrastructure/data/prisma/prisma-log-repository";

const createAddOrUpdateProcedureUseCase = (dependencies: {
  procedureRepositoryDb: ProcedureRepositoryPort;
  logRepositoryDb: LogRepositoryPort;
}) => {
  return {
    execute: async (data: ProcedureCreateData): Promise<Procedure> => {
      if (!data.visitId) {
        throw new Error("Missing visitId.");
      }
      return dependencies.procedureRepositoryDb.addOrUpdate(data);
    },
  };
};

const addOrUpdateProcedureUseCase = createAddOrUpdateProcedureUseCase({
  procedureRepositoryDb,
  logRepositoryDb,
});

export type AddOrUpdateProcedureUseCaseType = ReturnType<
  typeof createAddOrUpdateProcedureUseCase
>;

export default addOrUpdateProcedureUseCase;
