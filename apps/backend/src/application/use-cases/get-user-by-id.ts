import { User } from "@/entities/user";
import { UserRepository } from "@/application/ports/user-repository";

// You might define custom errors for your domain/application layer
class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with ID ${id} not found.`);
    this.name = "UserNotFoundError";
  }
}

/**
 * Use case to retrieve a user by their ID.
 */
export class GetUserById {
  private readonly userRepository: UserRepository;

  /**
   * @param userRepository An implementation of the UserRepository interface.
   */
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the use case.
   * @param userId The ID of the user to retrieve.
   * @returns A Promise that resolves to the User entity.
   * @throws UserNotFoundError if no user with the given ID is found.
   */
  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return user;
  }
}
