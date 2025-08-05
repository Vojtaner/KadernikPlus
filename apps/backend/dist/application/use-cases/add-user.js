"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_user_repository_1 = __importDefault(require("../../infrastructure/data/prisma/prisma-user-repository"));
class UserAlreadyExistsError extends Error {
    constructor(email) {
        super(`User with email ${email} already exists.`);
        this.name = "UserAlreadyExistsError";
    }
}
const createAddUserUseCase = (dependencies) => {
    return {
        execute: async (userData) => {
            const existingUser = await dependencies.userRepositoryDb.findById(userData.id);
            if (existingUser) {
                throw new UserAlreadyExistsError(userData.email);
            }
            const newUser = await dependencies.userRepositoryDb.add(userData);
            return newUser;
        },
    };
};
const addUserUseCase = createAddUserUseCase({ userRepositoryDb: prisma_user_repository_1.default });
exports.default = addUserUseCase;
