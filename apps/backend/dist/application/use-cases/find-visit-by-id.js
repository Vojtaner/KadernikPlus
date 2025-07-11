"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const visit_mapper_1 = __importDefault(require("../../infrastructure/mappers/visit-mapper"));
const prisma_visit_repository_1 = __importDefault(require("../../infrastructure/data/prisma/prisma-visit-repository"));
const createFindVisitById = (dependencies) => {
    return {
        execute: async (id) => {
            const visit = await dependencies.visitRepositoryDb.findById(id);
            return visit ? (0, visit_mapper_1.default)(visit) : null;
        },
    };
};
const findVisitByIdUseCase = createFindVisitById({ visitRepositoryDb: prisma_visit_repository_1.default });
exports.default = findVisitByIdUseCase;
