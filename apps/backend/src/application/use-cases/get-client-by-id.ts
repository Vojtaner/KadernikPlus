import { Client } from "@/entities/client";
import { ClientRepository } from "@/application/ports/client-repository";

// Custom error for application layer
class ClientNotFoundError extends Error {
  constructor(id: string) {
    super(`Client with ID '${id}' not found.`);
    this.name = "ClientNotFoundError";
  }
}

/**
 * Use case to retrieve a client by their unique ID.
 */
export class GetClientById {
  private readonly clientRepository: ClientRepository;

  /**
   * @param clientRepository An implementation of the ClientRepository interface.
   */
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  /**
   * Executes the use case.
   * @param clientId The ID of the client to retrieve.
   * @returns A Promise that resolves to the Client entity.
   * @throws ClientNotFoundError if no client with the given ID is found.
   */
  async execute(clientId: string): Promise<Client> {
    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      throw new ClientNotFoundError(clientId);
    }

    return client;
  }
}
