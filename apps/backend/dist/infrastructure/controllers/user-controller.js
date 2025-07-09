"use strict";
// src/infrastructure/controllers/user-controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
/**
 * UserController handles HTTP requests related to User entities.
 * It translates HTTP requests into calls to application layer use cases
 * and translates use case results back into HTTP responses.
 */
class UserController {
    constructor(dependencies) {
        /**
         * Handles the HTTP POST request to create a new user.
         * Expects user data in the request body.
         */
        this.addUserController = async (httpRequest) => {
            try {
                const userData = httpRequest.body;
                // Input validation (basic example - use a validation library in real app)
                if (!userData.name || !userData.email || !userData.passwordHash) {
                    return {
                        statusCode: 400,
                        body: {
                            error: "Missing required user fields: name, email, passwordHash.",
                        },
                    };
                }
                // Call the AddUser use case (application layer)
                const newUser = await this.addUserUseCase.execute(userData);
                return {
                    statusCode: 201, // 201 Created
                    body: newUser,
                };
            }
            catch (error) {
                // Handle specific application-level errors
                if (error.name === "UserAlreadyExistsError") {
                    return {
                        statusCode: 409, // Conflict
                        body: { error: error.message },
                    };
                }
                // Re-throw or handle other unexpected errors
                console.error("Error in addUserController:", error);
                throw error; // Let makeExpressCallback handle the generic 500 error
            }
        };
        /**
         * Handles the HTTP GET request to retrieve a user by ID.
         * Expects the user ID in the request parameters.
         */
        this.getUserByIdController = async (httpRequest) => {
            try {
                const { id } = httpRequest.params; // Get ID from URL parameters
                if (!id) {
                    return {
                        statusCode: 400,
                        body: { error: "Missing user ID in parameters." },
                    };
                }
                // Call the GetUserById use case (application layer)
                const user = await this.getUserByIdUseCase.execute(id);
                return {
                    statusCode: 200, // OK
                    body: user,
                };
            }
            catch (error) {
                // Handle specific application-level errors
                if (error.name === "UserNotFoundError") {
                    return {
                        statusCode: 404, // Not Found
                        body: { error: error.message },
                    };
                }
                // Re-throw or handle other unexpected errors
                console.error("Error in getUserByIdController:", error);
                throw error; // Let makeExpressCallback handle the generic 500 error
            }
        };
        this.addUserUseCase = dependencies.addUser;
        this.getUserByIdUseCase = dependencies.getUserById;
    }
}
exports.UserController = UserController;
