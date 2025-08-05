"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-client-repository"));
const prisma_log_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-log-repository"));
class ClientAlreadyExistsError extends Error {
    constructor(phone) {
        super(`Client with phone number '${phone}' already exists.`);
        this.name = "ClientAlreadyExistsError";
    }
}
const createAddOrUpdateClientUseCase = (dependencies) => {
    return {
        execute: async (clientData) => {
            let action = "create";
            let clientId = undefined;
            let message = "";
            const newOrUpdatedClient = await dependencies.clientRepositoryDb.addOrUpdate(clientData);
            if (clientData.id) {
                action = "update";
                clientId = clientData.id;
                message = `Upravený klient ${clientData.firstName} ${clientData.lastName}`;
            }
            else {
                clientId = newOrUpdatedClient.id;
                message = `Vytvořen klient ${newOrUpdatedClient.firstName} ${newOrUpdatedClient.lastName}`;
            }
            await dependencies.logRepositoryDb.log({
                userId: clientData.userId,
                action,
                entityType: "client",
                entityId: clientId,
                message,
                metadata: { input: clientData },
                teamId: newOrUpdatedClient.teamId,
            });
            return newOrUpdatedClient;
        },
    };
};
const addOrUpdateClientUseCase = createAddOrUpdateClientUseCase({
    clientRepositoryDb: prisma_client_repository_1.default,
    logRepositoryDb: prisma_log_repository_1.default,
});
exports.default = addOrUpdateClientUseCase;
