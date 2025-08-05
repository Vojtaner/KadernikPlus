"use strict";
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
