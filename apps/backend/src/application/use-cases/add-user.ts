import { User, UserCreateData } from "@/domain/entities/user";
import { UserRepository } from "@/application/ports/user-repository";

// You might define custom errors for your domain/application layer
class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists.`);
    this.name = "UserAlreadyExistsError";
  }
}

/**
 * Use case to add a new user to the system.
 * It encapsulates the business rule that a user's email must be unique.
 */
export class AddUser {
  private readonly userRepository: UserRepository;

  /**
   * @param userRepository An implementation of the UserRepository interface.
   * This is where dependency injection happens. The use case doesn't know
   * or care if it's Prisma, TypeORM, or an in-memory database.
   */
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the use case.
   * @param userData The data for the new user.
   * @returns A Promise that resolves to the created User entity.
   * @throws UserAlreadyExistsError if a user with the given email already exists.
   */
  async execute(userData: UserCreateData): Promise<User> {
    // 1. Business rule: Check if a user with the same email already exists.
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(userData.email);
    }

    // 2. Persist the new user data using the repository.
    // The repository handles the actual database interaction.
    const newUser = await this.userRepository.add(userData);

    return newUser;
  }
}
