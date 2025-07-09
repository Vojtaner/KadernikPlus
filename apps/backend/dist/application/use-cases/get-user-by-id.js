"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserById = void 0;
// You might define custom errors for your domain/application layer
class UserNotFoundError extends Error {
    constructor(id) {
        super(`User with ID ${id} not found.`);
        this.name = "UserNotFoundError";
    }
}
/**
 * Use case to retrieve a user by their ID.
 */
class GetUserById {
    /**
     * @param userRepository An implementation of the UserRepository interface.
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Executes the use case.
     * @param userId The ID of the user to retrieve.
     * @returns A Promise that resolves to the User entity.
     * @throws UserNotFoundError if no user with the given ID is found.
     */
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundError(userId);
        }
        return user;
    }
}
exports.GetUserById = GetUserById;
