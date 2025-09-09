"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d7504b43-c108-5815-a23f-a91706867de0")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVisitUseCase = void 0;
exports.createUpdateVisitUseCase = createUpdateVisitUseCase;
const prisma_visit_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-visit-repository"));
function createUpdateVisitUseCase(dependencies) {
    return {
        execute: async (visitData) => {
            const updated = await dependencies.visitRepositoryDb.update(visitData);
            return updated;
        },
    };
}
exports.updateVisitUseCase = createUpdateVisitUseCase({
    visitRepositoryDb: prisma_visit_repository_1.default,
});
//# sourceMappingURL=update-visit.js.map
//# debugId=d7504b43-c108-5815-a23f-a91706867de0
