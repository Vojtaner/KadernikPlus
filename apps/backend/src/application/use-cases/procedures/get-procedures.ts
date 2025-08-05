import { Procedure } from ".prisma/client";
import { ProcedureRepositoryPort } from "../../ports/procedure-repository";
import procedureRepositoryDb from "../../../infrastructure/data/prisma/prisma-procedure-repository";

export const createGetProceduresUseCase = (dependencies: {
  procedureRepository: ProcedureRepositoryPort;
}) => ({
  execute: async (visitId: string): Promise<Procedure[]> => {
    if (!visitId) {
      throw new Error("visitId is required");
    }
    return dependencies.procedureRepository.findByVisitId(visitId);
  },
});

export type GetProceduresUseCaseType = ReturnType<
  typeof createGetProceduresUseCase
>;

const getProceduresUseCase = createGetProceduresUseCase({
  procedureRepository: procedureRepositoryDb,
});

export default getProceduresUseCase;
