"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0edd1987-9147-517f-bcf0-5867204fa62e")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_visit_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-visit-repository"));
const prisma_client_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-client-repository"));
const add_visit_1 = require("./add-visit");
const createGetVisitsByClientIdUseCase = (dependencies) => {
    return {
        execute: async (clientId, userId) => {
            const clientExists = await dependencies.clientRepositoryDb.findById(clientId, userId);
            if (!clientExists) {
                throw (0, add_visit_1.ClientNotFoundError)(clientId);
            }
            const visits = await dependencies.visitRepositoryDb.findAll(clientId);
            return visits;
        },
    };
};
const getVisitsByClientIdUseCase = createGetVisitsByClientIdUseCase({
    visitRepositoryDb: prisma_visit_repository_1.default,
    clientRepositoryDb: prisma_client_repository_1.default,
});
exports.default = getVisitsByClientIdUseCase;
//# sourceMappingURL=get-visits-by-client-id.js.map
//# debugId=0edd1987-9147-517f-bcf0-5867204fa62e
