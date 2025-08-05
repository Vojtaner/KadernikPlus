"use strict";
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
