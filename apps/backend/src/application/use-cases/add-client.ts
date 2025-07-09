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

/**
 * Use case to add a new client to the system.
 * Encapsulates the business rule that client email (if provided) must be unique.
 */
export class AddClient {
  private readonly clientRepository: ClientRepository;

  /**
   * @param clientRepository An implementation of the ClientRepository interface.
   * This is where dependency injection happens.
   */
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  /**
   * Executes the use case to add a new client.
   * @param clientData The data for the new client.
   * @returns A Promise that resolves to the created Client entity.
   * @throws ClientAlreadyExistsError if a client with the given email already exists.
   */
  async execute(clientData: ClientCreateData): Promise<Client> {
    // Business rule: If an email is provided, it must be unique.
    if (clientData.email) {
      const existingClient = await this.clientRepository.findByEmail(
        clientData.email
      );
      if (existingClient) {
        throw new ClientAlreadyExistsError(clientData.email);
      }
    }

    // Persist the new client data using the repository.
    const newClient = await this.clientRepository.add(clientData);

    return newClient;
  }
}

const createAddClientUseCase = (dependencies: {
  clientRepositoryDb: ClientRepositoryPort;
}) => {
  return {
    execute: async (clientData: ClientCreateData): Promise<Client> => {
      if (clientData.email) {
        const existingClient =
          await dependencies.clientRepositoryDb.findByEmail(clientData.email);
        if (existingClient) {
          throw new ClientAlreadyExistsError(clientData.email);
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
