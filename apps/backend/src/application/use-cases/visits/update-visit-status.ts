import { VisitRepositoryPort } from "../../ports/visit-repository";
import visitRepositoryDb from "../../../infrastructure/data/prisma/prisma-visit-repository";
import { Visit } from "@prisma/client";

export function createUpdateVisitStatusUseCase(dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
}) {
  return {
    execute: async (data: {
      visitId: string;
      status: boolean;
    }): Promise<Visit> => {
      const { status, visitId } = data;
      const updated = await dependencies.visitRepositoryDb.updateStatus(
        visitId,
        status
      );
      return updated;
    },
  };
}

export type UpdateVisitStatusUseCaseType = ReturnType<
  typeof createUpdateVisitStatusUseCase
>;

const updateVisitStatusUseCase = createUpdateVisitStatusUseCase({
  visitRepositoryDb,
});

export default updateVisitStatusUseCase;
