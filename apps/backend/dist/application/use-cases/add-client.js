"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_repository_1 = __importDefault(require("../../infrastructure/data/prisma/prisma-client-repository"));
// Custom error for application layer
class ClientAlreadyExistsError extends Error {
    constructor(email) {
        super(`Client with email '${email}' already exists.`);
        this.name = "ClientAlreadyExistsError";
    }
}
const createAddClientUseCase = (dependencies) => {
    return {
        execute: async (clientData) => {
            if (clientData.phone) {
                const existingClient = await dependencies.clientRepositoryDb.findByPhone(clientData.phone);
                if (existingClient) {
                    throw new ClientAlreadyExistsError(clientData.phone);
                }
            }
            const newClient = await dependencies.clientRepositoryDb.add(clientData);
            return newClient;
        },
    };
};
const addClientUseCase = createAddClientUseCase({ clientRepositoryDb: prisma_client_repository_1.default });
exports.default = addClientUseCase;
