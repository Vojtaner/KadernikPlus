// application/use-cases/procedure/add-or-update-procedure.ts
import {
  ProcedureCreateData,
  ProcedureRepositoryPort,
} from "@/application/ports/procedure-repository";
import procedureRepositoryDb from "../../../infrastructure/data/prisma/prisma-procedure-repository";
import { Procedure } from ".prisma/client";

const createAddOrUpdateProcedureUseCase = (dependencies: {
  procedureRepositoryDb: ProcedureRepositoryPort;
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
  procedureRepositoryDb: procedureRepositoryDb,
});

export type AddOrUpdateProcedureUseCaseType = ReturnType<
  typeof createAddOrUpdateProcedureUseCase
>;

export default addOrUpdateProcedureUseCase;
