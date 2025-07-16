import { VisitRepositoryPort } from "../../ports/visit-repository";
import visitRepositoryDb from "../../../infrastructure/data/prisma/prisma-visit-repository";
import { Visit } from "@prisma/client";

export function createUpdateVisitUseCase(dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
}) {
  return {
    //je potřeba doladit data, co se dají upravovat kadeřnice, záloha, stav návštěvy, datum, výše zálohy,poznámka
    execute: async (visitData: any): Promise<Visit> => {
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
