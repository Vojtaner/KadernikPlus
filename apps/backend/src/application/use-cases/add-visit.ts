import { Visit, VisitCreateData } from "@/domain/entities/visit";
import { VisitRepository } from "@/application/ports/visit-repository";
import { UserRepository } from "@/application/ports/user-repository"; // To validate userId
import { ClientRepository } from "@/application/ports/client-repository"; // To validate clientId

// Custom errors for application layer
class UserNotFoundError extends Error {
  // Re-using or extending existing user error
  constructor(id: string) {
    super(`User with ID '${id}' not found.`);
    this.name = "UserNotFoundError";
  }
}

export class ClientNotFoundError extends Error {
  // Re-using or extending existing client error
  constructor(id: string) {
    super(`Client with ID '${id}' not found.`);
    this.name = "ClientNotFoundError";
  }
}

/**
 * Use case to add a new visit to the system.
 * It encapsulates the business rules that both the client and user (hairdresser)
 * associated with the visit must exist.
 */
export class AddVisit {
  private readonly visitRepository: VisitRepository;
  private readonly userRepository: UserRepository;
  private readonly clientRepository: ClientRepository;

  /**
   * @param visitRepository An implementation of the VisitRepository interface.
   * @param userRepository An implementation of the UserRepository interface (for validation).
   * @param clientRepository An implementation of the ClientRepository interface (for validation).
   */
  constructor(
    visitRepository: VisitRepository,
    userRepository: UserRepository,
    clientRepository: ClientRepository,
  ) {
    this.visitRepository = visitRepository;
    this.userRepository = userRepository;
    this.clientRepository = clientRepository;
  }

  /**
   * Executes the use case to add a new visit.
   * @param visitData The data for the new visit.
   * @returns A Promise that resolves to the created Visit entity.
   * @throws UserNotFoundError if the specified user does not exist.
   * @throws ClientNotFoundError if the specified client does not exist.
   */
  async execute(visitData: VisitCreateData): Promise<Visit> {
    // 1. Business rule: Ensure the associated user (hairdresser) exists.
    const userExists = await this.userRepository.findById(visitData.userId);
    if (!userExists) {
      throw new UserNotFoundError(visitData.userId);
    }

    // 2. Business rule: Ensure the associated client exists.
    const clientExists = await this.clientRepository.findById(
      visitData.clientId,
    );
    if (!clientExists) {
      throw new ClientNotFoundError(visitData.clientId);
    }

    // 3. Persist the new visit data using the repository.
    const newVisit = await this.visitRepository.add(visitData);

    return newVisit;
  }
}
