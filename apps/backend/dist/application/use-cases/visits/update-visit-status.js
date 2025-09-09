"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="05f1eac3-11aa-525b-b3a5-ea970c955c20")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdateVisitStatusUseCase = createUpdateVisitStatusUseCase;
const prisma_visit_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-visit-repository"));
function createUpdateVisitStatusUseCase(dependencies) {
    return {
        execute: async (data) => {
            const { status, visitId } = data;
            const updated = await dependencies.visitRepositoryDb.updateStatus(visitId, status);
            return updated;
        },
    };
}
const updateVisitStatusUseCase = createUpdateVisitStatusUseCase({
    visitRepositoryDb: prisma_visit_repository_1.default,
});
exports.default = updateVisitStatusUseCase;
//# sourceMappingURL=update-visit-status.js.map
//# debugId=05f1eac3-11aa-525b-b3a5-ea970c955c20
