"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs")); // For password comparison
// Custom errors for application layer
class InvalidCredentialsError extends Error {
    constructor() {
        super("Invalid email or password.");
        this.name = "InvalidCredentialsError";
    }
}
/**
 * Use case to log in a user with email and password.
 * It verifies credentials and returns the user if successful.
 */
class LoginUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Executes the login process.
     * @param email The user's email.
     * @param password The user's plain text password.
     * @returns A Promise that resolves to the User entity if authentication is successful.
     * @throws InvalidCredentialsError if email/password do not match.
     */
    async execute(email, password) {
        // 1. Find the user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new InvalidCredentialsError();
        }
        // 2. Compare the provided password with the stored hashed password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new InvalidCredentialsError();
        }
        // 3. Update last login time (optional, but good practice)
        // This would ideally require an `update` method on your UserRepository.
        // For now, we'll just return the user, assuming `add` or a dedicated `update`
        // in PrismaUserRepository would handle this if implemented.
        // Example (if update existed): await this.userRepository.update(user.id, { lastLogin: new Date() });
        return user;
    }
}
exports.LoginUser = LoginUser;
