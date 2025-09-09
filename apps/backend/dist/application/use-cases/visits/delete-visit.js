"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ce17d87e-e8b9-5cb2-be3e-ce6c63957fbd")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeleteVisitUseCase = createDeleteVisitUseCase;
const prisma_visit_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-visit-repository"));
function createDeleteVisitUseCase(dependencies) {
    return {
        execute: async (visitId) => {
            await dependencies.visitRepositoryDb.delete(visitId);
        },
    };
}
const deleteVisitUseCase = createDeleteVisitUseCase({ visitRepositoryDb: prisma_visit_repository_1.default });
exports.default = deleteVisitUseCase;
//# sourceMappingURL=delete-visit.js.map
//# debugId=ce17d87e-e8b9-5cb2-be3e-ce6c63957fbd
