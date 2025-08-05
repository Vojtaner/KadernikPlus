"use strict";
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
