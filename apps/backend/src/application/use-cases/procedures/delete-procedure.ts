import { ProcedureRepositoryPort } from "@/application/ports/procedure-repository";
import procedureRepositoryDb from "../../../infrastructure/data/prisma/prisma-procedure-repository";

const createDeleteProcedureUseCase = (dependencies: {
  procedureRepositoryDb: ProcedureRepositoryPort;
}) => {
  return {
    execute: async (procedureId: string): Promise<string> => {
      if (!procedureId) {
        throw new Error("Missing procedureId.");
      }

      return dependencies.procedureRepositoryDb.delete(procedureId);
    },
  };
};

const deleteProcedureUseCase = createDeleteProcedureUseCase({
  procedureRepositoryDb: procedureRepositoryDb,
});

export type DeleteProcedureUseCaseType = ReturnType<
  typeof createDeleteProcedureUseCase
>;

export default deleteProcedureUseCase;
