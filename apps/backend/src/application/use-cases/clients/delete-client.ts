import { ClientRepositoryPort } from "../../../application/ports/client-repository";
import clientRepositoryDb from "../../../infrastructure/data/prisma/prisma-client-repository";
import { httpError } from "../../../adapters/express/httpError";
import { Client } from "@prisma/client";
import { VisitRepositoryPort } from "../../../application/ports/visit-repository";
import visitRepositoryDb from "../../../infrastructure/data/prisma/prisma-visit-repository";

const createDeleteClientByIdUseCase = (dependencies: {
  clientRepositoryDb: ClientRepositoryPort;
  visitRepositoryDb: VisitRepositoryPort;
}) => {
  return {
    execute: async (userId: string, clientId: string): Promise<Client> => {
      const client = await dependencies.clientRepositoryDb.findById(
        clientId,
        userId
      );

      if (!client) {
        throw httpError("Klient nenalezen", 404);
      }

      const visits = await dependencies.visitRepositoryDb.findAll(clientId);

      if (visits.length > 0) {
        throw httpError("Klienta s návštěvami nelze smazat.", 404);
      }

      const deletedClient = await dependencies.clientRepositoryDb.deleteById(
        client.id
      );

      return deletedClient;
    },
  };
};

const deleteClientByIdUseCase = createDeleteClientByIdUseCase({
  clientRepositoryDb,
  visitRepositoryDb,
});

export type DeleteClientByIdUseCaseType = ReturnType<
  typeof createDeleteClientByIdUseCase
>;
export default deleteClientByIdUseCase;
