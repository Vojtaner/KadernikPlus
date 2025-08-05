"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-client-repository"));
const createGetAllClientsByUserIdUseCase = (dependencies) => {
    return {
        execute: async (userId) => {
            const clients = await dependencies.clientRepositoryDb.findAll(userId);
            return clients;
        },
    };
};
const getAllClientsByUserIdUseCase = createGetAllClientsByUserIdUseCase({
    clientRepositoryDb: prisma_client_repository_1.default,
});
exports.default = getAllClientsByUserIdUseCase;
