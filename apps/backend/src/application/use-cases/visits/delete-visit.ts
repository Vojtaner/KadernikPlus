import { VisitRepositoryPort } from "../../ports/visit-repository";
import visitRepositoryDb from "../../../infrastructure/data/prisma/prisma-visit-repository";

export function createDeleteVisitUseCase(dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
}) {
  return {
    execute: async (visitId: string): Promise<void> => {
      await dependencies.visitRepositoryDb.delete(visitId);
    },
  };
}

export type CreateDeleteVisitUseCaseType = ReturnType<
  typeof createDeleteVisitUseCase
>;

const deleteVisitUseCase = createDeleteVisitUseCase({ visitRepositoryDb });

export default deleteVisitUseCase;
