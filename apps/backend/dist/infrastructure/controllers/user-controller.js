"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_user_1 = __importDefault(require("../../application/use-cases/user/add-user"));
const get_user_by_id_1 = __importDefault(require("../../application/use-cases/user/get-user-by-id"));
const createUserController = (dependencies) => {
    const addUserController = async (httpRequest) => {
        try {
            const userData = httpRequest.body;
            // Input validation (basic example - use a validation library in real app)
            if (!userData.name || !userData.email) {
                return {
                    statusCode: 400,
                    body: {
                        error: "Missing required user fields: name, email.",
                    },
                };
            }
            // Call the AddUser use case (application layer)
            const newUser = await dependencies.addUserUseCase.execute(userData);
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
    const getUserByIdController = async (httpRequest) => {
        try {
            const { id } = httpRequest.params;
            if (!id) {
                return {
                    statusCode: 400,
                    body: { error: "Missing user ID in parameters." },
                };
            }
            const user = await dependencies.getUserByIdUseCase.execute(id);
            return {
                statusCode: 200,
                body: user,
            };
        }
        catch (error) {
            if (error.name === "UserNotFoundError") {
                return {
                    statusCode: 404,
                    body: { error: error.message },
                };
            }
            console.error("Error in getUserByIdController:", error);
            throw error;
        }
    };
    return { addUserController, getUserByIdController };
};
const userController = createUserController({
    getUserByIdUseCase: get_user_by_id_1.default,
    addUserUseCase: add_user_1.default,
});
exports.default = userController;
