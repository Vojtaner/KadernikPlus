import { VisitRepositoryPort } from "../../ports/visit-repository";
import visitRepositoryDb from "../../../infrastructure/data/prisma/prisma-visit-repository";
import { Service, Visit } from "@prisma/client";

export function createGetVisitsByDatesUseCase(dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
}) {
  return {
    execute: async (dateOrRange: {
      date?: Date;
      from?: Date;
      to?: Date;
      userId: string;
    }): Promise<Omit<Visit, "serviceIds"> & { services: Service[] }[]> => {
      return dependencies.visitRepositoryDb.findByDate(dateOrRange);
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
