"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="710d3b94-2bcc-5bd5-8afd-af95c0699212")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_user_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-user-repository"));
const UserNotFoundError = (id) => {
    const error = new Error(`User with ID ${id} not found.`);
    error.name = "UserNotFoundError";
    throw error;
};
const createGetUserByIdUseCase = (dependencies) => {
    return {
        execute: async (userId) => {
            const user = await dependencies.userRepositoryDb.findById(userId);
            if (!user) {
                return UserNotFoundError(userId);
            }
            return user;
        },
    };
};
const getUserByIdUseCase = createGetUserByIdUseCase({ userRepositoryDb: prisma_user_repository_1.default });
exports.default = getUserByIdUseCase;
//# sourceMappingURL=get-user-by-id.js.map
//# debugId=710d3b94-2bcc-5bd5-8afd-af95c0699212
