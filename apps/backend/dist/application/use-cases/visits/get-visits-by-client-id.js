"use strict";
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
