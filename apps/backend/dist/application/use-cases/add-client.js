"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddClient = void 0;
const prisma_client_repository_1 = __importDefault(require("../../infrastructure/data/prisma/prisma-client-repository"));
// Custom error for application layer
class ClientAlreadyExistsError extends Error {
    constructor(email) {
        super(`Client with email '${email}' already exists.`);
        this.name = "ClientAlreadyExistsError";
    }
}
/**
 * Use case to add a new client to the system.
 * Encapsulates the business rule that client email (if provided) must be unique.
 */
class AddClient {
    /**
     * @param clientRepository An implementation of the ClientRepository interface.
     * This is where dependency injection happens.
     */
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    /**
     * Executes the use case to add a new client.
     * @param clientData The data for the new client.
     * @returns A Promise that resolves to the created Client entity.
     * @throws ClientAlreadyExistsError if a client with the given email already exists.
     */
    async execute(clientData) {
        // Business rule: If an email is provided, it must be unique.
        if (clientData.email) {
            const existingClient = await this.clientRepository.findByEmail(clientData.email);
            if (existingClient) {
                throw new ClientAlreadyExistsError(clientData.email);
            }
        }
        // Persist the new client data using the repository.
        const newClient = await this.clientRepository.add(clientData);
        return newClient;
    }
}
exports.AddClient = AddClient;
const createAddClientUseCase = (dependencies) => {
    return {
        execute: async (clientData) => {
            if (clientData.email) {
                const existingClient = await dependencies.clientRepositoryDb.findByEmail(clientData.email);
                if (existingClient) {
                    throw new ClientAlreadyExistsError(clientData.email);
                }
            }
            const newClient = await dependencies.clientRepositoryDb.add(clientData);
            return newClient;
        },
    };
};
const addClientUseCase = createAddClientUseCase({ clientRepositoryDb: prisma_client_repository_1.default });
exports.default = addClientUseCase;
