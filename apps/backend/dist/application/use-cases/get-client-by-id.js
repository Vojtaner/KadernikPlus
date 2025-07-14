"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_repository_1 = __importDefault(require("../../infrastructure/data/prisma/prisma-client-repository"));
// Custom error for application layer
class ClientNotFoundError extends Error {
    constructor(id) {
        super(`Client with ID '${id}' not found.`);
        this.name = "ClientNotFoundError";
    }
}
const createGetClientByIdUseCase = (dependencies) => {
    return {
        execute: async (clientId) => {
            const client = await dependencies.clientRepositoryDb.findById(clientId);
            if (!client) {
                throw new ClientNotFoundError(clientId);
            }
            return client;
        },
    };
};
const getClientByIdUseCase = createGetClientByIdUseCase({ clientRepositoryDb: prisma_client_repository_1.default });
exports.default = getClientByIdUseCase;
