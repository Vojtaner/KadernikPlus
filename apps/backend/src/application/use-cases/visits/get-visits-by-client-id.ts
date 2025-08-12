import { VisitRepositoryPort } from "@/application/ports/visit-repository";
import { ClientRepositoryPort } from "@/application/ports/client-repository";
import visitRepositoryDb from "../../../infrastructure/data/prisma/prisma-visit-repository";
import clientRepositoryDb from "../../../infrastructure/data/prisma/prisma-client-repository";
import { ClientNotFoundError } from "./add-visit";
import { VisitWithServicesWithProceduresWithStockAllowances } from "@/infrastructure/mappers/visit-mapper";

const createGetVisitsByClientIdUseCase = (dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
  clientRepositoryDb: ClientRepositoryPort;
}) => {
  return {
    execute: async (
      clientId: string,
      userId: string
    ): Promise<VisitWithServicesWithProceduresWithStockAllowances[]> => {
      const clientExists = await dependencies.clientRepositoryDb.findById(
        clientId,
        userId
      );

      if (!clientExists) {
        throw ClientNotFoundError(clientId);
      }

      const visits = await dependencies.visitRepositoryDb.findAll(clientId);

      return visits;
    },
  };
};

const getVisitsByClientIdUseCase = createGetVisitsByClientIdUseCase({
  visitRepositoryDb: visitRepositoryDb,
  clientRepositoryDb: clientRepositoryDb,
});

export type CreateGetVisitsByClientIdUseCaseType = ReturnType<
  typeof createGetVisitsByClientIdUseCase
>;

export default getVisitsByClientIdUseCase;
