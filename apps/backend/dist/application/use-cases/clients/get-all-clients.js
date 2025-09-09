"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6ea2ed8f-7c55-5767-b99e-de8d05711d41")}catch(e){}}();

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
//# sourceMappingURL=get-all-clients.js.map
//# debugId=6ea2ed8f-7c55-5767-b99e-de8d05711d41
