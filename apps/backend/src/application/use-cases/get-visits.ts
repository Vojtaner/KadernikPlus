import { Visit } from "@/entities/visit";
import { VisitRepositoryPort } from "@/application/ports/visit-repository";
import { ClientRepositoryPort } from "@/application/ports/client-repository";
import { ClientNotFoundError } from "./add-visit";
import visitRepositoryDb from "../../infrastructure/data/prisma/prisma-visit-repository";
import clientRepositoryDb from "../../infrastructure/data/prisma/prisma-client-repository";

const createGetVisitsUseCase = (dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
  clientRepositoryDb: ClientRepositoryPort;
}) => {
  return {
    execute: async (clientId?: string): Promise<Visit[]> => {
      if (clientId) {
        const clientExists = await dependencies.clientRepositoryDb.findById(
          clientId
        );
        if (!clientExists) {
          throw ClientNotFoundError(clientId);
        }
      }

      const visits = await dependencies.visitRepositoryDb.findAll(clientId);
      return visits;
    },
  };
};

const getVisitsUseCase = createGetVisitsUseCase({
  visitRepositoryDb: visitRepositoryDb,
  clientRepositoryDb: clientRepositoryDb,
});

export type CreateGetVisitsUseCaseType = ReturnType<
  typeof createGetVisitsUseCase
>;

export default getVisitsUseCase;
