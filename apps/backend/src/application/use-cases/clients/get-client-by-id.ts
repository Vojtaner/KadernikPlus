import { Client } from "@/entities/client";
import { ClientRepositoryPort } from "../../ports/client-repository";
import clientRepositoryDb from "../../../infrastructure/data/prisma/prisma-client-repository";

// Custom error for application layer
class ClientNotFoundError extends Error {
  constructor(id: string) {
    super(`Client with ID '${id}' not found.`);
    this.name = "ClientNotFoundError";
  }
}

const createGetClientByIdUseCase = (dependencies: {
  clientRepositoryDb: ClientRepositoryPort;
}) => {
  return {
    execute: async (clientId: string): Promise<Client> => {
      const client = await dependencies.clientRepositoryDb.findById(clientId);

      if (!client) {
        throw new ClientNotFoundError(clientId);
      }

      return client;
    },
  };
};

export type CreateGetClientByIdUseCaseType = ReturnType<
  typeof createGetClientByIdUseCase
>;

const getClientByIdUseCase = createGetClientByIdUseCase({ clientRepositoryDb });

export default getClientByIdUseCase;
