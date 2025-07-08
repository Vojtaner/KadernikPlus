import { Visit, VisitCreateData } from "@/entities/visit";

/**
 * Defines the interface for visit data persistence operations (a "Port").
 * The Application Layer depends on this interface.
 */
export interface VisitRepository {
  /**
   * Inserts a new visit into the database.
   * @param visitData The data for the new visit.
   * @returns A Promise that resolves to the created Visit entity.
   */
  add(visitData: VisitCreateData): Promise<Visit>;

  /**
   * Finds a visit by its unique ID.
   * @param id The ID of the visit to find.
   * @returns A Promise that resolves to the Visit entity or null if not found.
   */
  findById(id: string): Promise<Visit | null>;

  /**
   * Retrieves all visits, optionally filtered by client ID.
   * @param clientId (Optional) The ID of the client to filter visits by.
   * @returns A Promise that resolves to an array of Visit entities.
   */
  findAll(clientId?: string): Promise<Visit[]>;

  // Add more methods as needed (update, delete, filter by date range, etc.)
}

export type VisitRepositoryPort = {
  add: (vistiData: VisitCreateData) => Promise<Visit>;
};
