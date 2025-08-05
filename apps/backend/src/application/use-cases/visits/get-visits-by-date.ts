import { VisitRepositoryPort } from "../../ports/visit-repository";
import visitRepositoryDb from "../../../infrastructure/data/prisma/prisma-visit-repository";
import { VisitWithServices } from "../../../infrastructure/mappers/visit-mapper";

export function createGetVisitsByDatesUseCase(dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
}) {
  return {
    execute: async (dateOrRange: {
      date?: Date;
      from?: Date;
      to?: Date;
      userId: string;
    }): Promise<VisitWithServices[]> => {
      const visits = await dependencies.visitRepositoryDb.findByDate(
        dateOrRange
      );

      return visits;
    },
  };
}

export type CreateGetVisitsByDatesUseCaseType = ReturnType<
  typeof createGetVisitsByDatesUseCase
>;

const getVisitsByDatesUseCase = createGetVisitsByDatesUseCase({
  visitRepositoryDb,
});

export default getVisitsByDatesUseCase;
