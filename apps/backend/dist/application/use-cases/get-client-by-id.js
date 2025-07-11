"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetClientById = void 0;
const prisma_client_repository_1 = __importDefault(require("../../infrastructure/data/prisma/prisma-client-repository"));
// Custom error for application layer
class ClientNotFoundError extends Error {
    constructor(id) {
        super(`Client with ID '${id}' not found.`);
        this.name = "ClientNotFoundError";
    }
}
/**
 * Use case to retrieve a client by their unique ID.
 */
class GetClientById {
    /**
     * @param clientRepository An implementation of the ClientRepository interface.
     */
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    /**
     * Executes the use case.
     * @param clientId The ID of the client to retrieve.
     * @returns A Promise that resolves to the Client entity.
     * @throws ClientNotFoundError if no client with the given ID is found.
     */
    async execute(clientId) {
        const client = await this.clientRepository.findById(clientId);
        if (!client) {
            throw new ClientNotFoundError(clientId);
        }
        return client;
    }
}
exports.GetClientById = GetClientById;
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
