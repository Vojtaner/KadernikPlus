import { Client, ClientCreateData } from "@/entities/client";

/**
 * Defines the interface for client data persistence operations (a "Port").
 * The Application Layer depends on this interface, not on a concrete database implementation.
 */
export interface ClientRepository {
  /**
   * Inserts a new client into the database.
   * @param clientData The data for the new client.
   * @returns A Promise that resolves to the created Client entity.
   */
  add(clientData: ClientCreateData): Promise<Client>;

  /**
   * Finds a client by their unique ID.
   * @param id The ID of the client to find.
   * @returns A Promise that resolves to the Client entity or null if not found.
   */
  findById(id: string): Promise<Client | null>;

  /**
   * Finds a client by their email.
   * @param email The email of the client to find.
   * @returns A Promise that resolves to the Client entity or null if not found.
   */
  findByEmail(email: string): Promise<Client | null>;

  /**
   * Retrieves all clients from the database.
   * @returns A Promise that resolves to an array of Client entities.
   */
  findAll(): Promise<Client[]>;

  // Add more methods here as needed (update, delete, search by name/phone, etc.)
}

export type ClientRepositoryPort = {
  add: (clientData: ClientCreateData) => Promise<Client>;
  findById: (id: string) => Promise<Client | null>;
  findAll: () => Promise<Client[]>;
  findByPhone: (phone: string) => Promise<Client | null>;
};
