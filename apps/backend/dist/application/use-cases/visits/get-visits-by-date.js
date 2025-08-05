"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetVisitsByDatesUseCase = createGetVisitsByDatesUseCase;
const prisma_visit_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-visit-repository"));
function createGetVisitsByDatesUseCase(dependencies) {
    return {
        execute: async (dateOrRange) => {
            const visits = await dependencies.visitRepositoryDb.findByDate(dateOrRange);
            return visits;
        },
    };
}
const getVisitsByDatesUseCase = createGetVisitsByDatesUseCase({
    visitRepositoryDb: prisma_visit_repository_1.default,
});
exports.default = getVisitsByDatesUseCase;
