import { VisitRepositoryPort } from "../../ports/visit-repository";
// import mapToDomainVisit from "../../../infrastructure/mappers/visit-mapper";
import visitRepositoryDb from "../../../infrastructure/data/prisma/prisma-visit-repository";
import { VisitWithServices } from "@/infrastructure/mappers/visit-mapper";

export function VisitNotFoundError(id: string): Error {
  const error = new Error(`Visit with ID '${id}' not found.`);
  error.name = "VisitNotFoundError";
  return error;
}

const createGetVisitByIdUseCase = (dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
}) => {
  return {
    //
    execute: async (visitId: string): Promise<VisitWithServices | null> => {
      const visit = await dependencies.visitRepositoryDb.findById(visitId);

      if (!visit) {
        throw VisitNotFoundError(visitId);
      }

      return visit ?? null;
    },
  };
};

const getVisitByIdUseCase = createGetVisitByIdUseCase({ visitRepositoryDb });

export type CreateGetVisitByIdUseCaseType = ReturnType<
  typeof createGetVisitByIdUseCase
>;
export default getVisitByIdUseCase;
