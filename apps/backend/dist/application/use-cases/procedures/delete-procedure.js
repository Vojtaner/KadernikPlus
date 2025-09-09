"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="04d6d40c-acb2-537c-ab16-2f731a7cc9a5")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_procedure_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-procedure-repository"));
const createDeleteProcedureUseCase = (dependencies) => {
    return {
        execute: async (procedureId) => {
            if (!procedureId) {
                throw new Error("Missing procedureId.");
            }
            return dependencies.procedureRepositoryDb.delete(procedureId);
        },
    };
};
const deleteProcedureUseCase = createDeleteProcedureUseCase({
    procedureRepositoryDb: prisma_procedure_repository_1.default,
});
exports.default = deleteProcedureUseCase;
//# sourceMappingURL=delete-procedure.js.map
//# debugId=04d6d40c-acb2-537c-ab16-2f731a7cc9a5
