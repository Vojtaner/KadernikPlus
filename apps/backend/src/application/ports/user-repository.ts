import { User, UserCreateData } from "@/entities/user";

/**
 * Defines the interface for user data persistence operations (a "Port").
 * The Application Layer depends on this interface, not on a concrete database implementation.
 */
export interface UserRepository {
  /**
   * Inserts a new user into the database.
   * @param userData The data for the new user.
   * @returns A Promise that resolves to the created User entity.
   */
  add(userData: UserCreateData): Promise<User>;

  /**
   * Finds a user by their unique ID.
   * @param id The ID of the user to find.
   * @returns A Promise that resolves to the User entity or null if not found.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by their email.
   * @param email The email of the user to find.
   * @returns A Promise that resolves to the User entity or null if not found.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Retrieves all users from the database.
   * @returns A Promise that resolves to an array of User entities.
   */
  findAll(): Promise<User[]>;

  // update(id: string, updates: Partial<User>): Promise<User | null>;
  // remove(id: string): Promise<boolean>;
}
