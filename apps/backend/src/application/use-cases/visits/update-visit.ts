import { VisitRepositoryPort } from "../../ports/visit-repository";
import visitRepositoryDb from "../../../infrastructure/data/prisma/prisma-visit-repository";
import { Visit } from "@prisma/client";
import { HasId } from "@/domain/entity";
import { VisitDetailFormType } from "@/entities/visit";

export function createUpdateVisitUseCase(dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
}) {
  return {
    execute: async (visitData: VisitDetailFormType & HasId): Promise<Visit> => {
      const updated = await dependencies.visitRepositoryDb.update(visitData);
      return updated;
    },
  };
}

export type CreateUpdateVisitUseCaseType = ReturnType<
  typeof createUpdateVisitUseCase
>;

export const updateVisitUseCase = createUpdateVisitUseCase({
  visitRepositoryDb,
});
