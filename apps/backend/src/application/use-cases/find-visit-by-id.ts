import { Visit } from "@/entities/visit";
import { VisitRepositoryPort } from "../ports/visit-repository";
import mapToDomainVisit from "../../infrastructure/mappers/visit-mapper";
import visitRepositoryDb from "../../infrastructure/data/prisma/prisma-visit-repository";

const createFindVisitById = (dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
}) => {
  return {
    execute: async (id: string): Promise<Visit | null> => {
      const visit = await dependencies.visitRepositoryDb.findById(id);
      return visit ? mapToDomainVisit(visit as unknown as any) : null;
    },
  };
};

const findVisitByIdUseCase = createFindVisitById({ visitRepositoryDb });

export type CreateFindVisitByIdType = ReturnType<typeof createFindVisitById>;
export default findVisitByIdUseCase;
