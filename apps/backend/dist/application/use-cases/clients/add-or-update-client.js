"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a1145955-b1dd-5ec5-90c3-178d717df32f")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-client-repository"));
const prisma_log_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-log-repository"));
const createAddOrUpdateClientUseCase = (dependencies) => {
    return {
        execute: async (clientData) => {
            const newOrUpdatedClient = await dependencies.clientRepositoryDb.addOrUpdate(clientData);
            //udělat na to usecase a přidat to jako usecase
            let action = "create";
            let clientId = undefined;
            let message = "";
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
//# sourceMappingURL=add-or-update-client.js.map
//# debugId=a1145955-b1dd-5ec5-90c3-178d717df32f
