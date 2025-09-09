"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d58cbbad-f3f1-5a01-9094-9344bcf512b6")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetProceduresUseCase = void 0;
const prisma_procedure_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-procedure-repository"));
const createGetProceduresUseCase = (dependencies) => ({
    execute: async (visitId) => {
        if (!visitId) {
            throw new Error("visitId is required");
        }
        return dependencies.procedureRepository.findByVisitId(visitId);
    },
});
exports.createGetProceduresUseCase = createGetProceduresUseCase;
const getProceduresUseCase = (0, exports.createGetProceduresUseCase)({
    procedureRepository: prisma_procedure_repository_1.default,
});
exports.default = getProceduresUseCase;
//# sourceMappingURL=get-procedures.js.map
//# debugId=d58cbbad-f3f1-5a01-9094-9344bcf512b6
