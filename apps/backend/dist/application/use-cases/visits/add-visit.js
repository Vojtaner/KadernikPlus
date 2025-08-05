"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVisitUseCase = void 0;
exports.UserNotFoundError = UserNotFoundError;
exports.ClientNotFoundError = ClientNotFoundError;
const prisma_visit_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-visit-repository"));
function UserNotFoundError(id) {
    const error = new Error(`User with ID '${id}' not found.`);
    error.name = "UserNotFoundError";
    return error;
}
function ClientNotFoundError(id) {
    const error = new Error(`Client with ID '${id}' not found.`);
    error.name = "ClientNotFoundError";
    return error;
}
const createAddVisitUseCase = (dependencies) => ({
    execute: async (visitData) => {
        const visit = await prisma_visit_repository_1.default.add(visitData);
        // a další logika s přidáním návštěvy emaily, jiné databázové operace atd...
        return visit;
    },
});
exports.addVisitUseCase = createAddVisitUseCase({ visitRepositoryDb: prisma_visit_repository_1.default });
