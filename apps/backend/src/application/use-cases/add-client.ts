import { Client, ClientCreateData } from "@/entities/client";
import {
  ClientRepository,
  ClientRepositoryPort,
} from "@/application/ports/client-repository";
import clientRepositoryDb from "../../infrastructure/data/prisma/prisma-client-repository";

// Custom error for application layer
class ClientAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Client with email '${email}' already exists.`);
    this.name = "ClientAlreadyExistsError";
  }
}

const createAddClientUseCase = (dependencies: {
  clientRepositoryDb: ClientRepositoryPort;
}) => {
  return {
    execute: async (clientData: ClientCreateData): Promise<Client> => {
      if (clientData.phone) {
        const existingClient =
          await dependencies.clientRepositoryDb.findByPhone(clientData.phone);
        if (existingClient) {
          throw new ClientAlreadyExistsError(clientData.phone);
        }
      }

      const newClient = await dependencies.clientRepositoryDb.add(clientData);

      return newClient;
    },
  };
};

const addClientUseCase = createAddClientUseCase({ clientRepositoryDb });

export type CreateAddClientUseCaseType = ReturnType<
  typeof createAddClientUseCase
>;
export default addClientUseCase;
