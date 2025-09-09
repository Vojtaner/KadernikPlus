"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="fe3a7bfd-d1bb-5afe-a0cb-3a4fc61de049")}catch(e){}}();

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
//# sourceMappingURL=add-or-update-procedure.js.map
//# debugId=fe3a7bfd-d1bb-5afe-a0cb-3a4fc61de049
