"use strict";
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
