"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_procedure_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-procedure-repository"));
const createAddOrUpdateProcedureUseCase = (dependencies) => {
    return {
        execute: async (data) => {
            if (!data.visitId) {
                throw new Error("Missing visitId.");
            }
            return dependencies.procedureRepositoryDb.addOrUpdate(data);
        },
    };
};
const addOrUpdateProcedureUseCase = createAddOrUpdateProcedureUseCase({
    procedureRepositoryDb: prisma_procedure_repository_1.default,
});
exports.default = addOrUpdateProcedureUseCase;
