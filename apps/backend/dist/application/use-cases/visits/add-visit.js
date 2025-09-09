"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="970d7dca-8a7d-5f04-9fc6-5b7b8d8e9129")}catch(e){}}();

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
//# sourceMappingURL=add-visit.js.map
//# debugId=970d7dca-8a7d-5f04-9fc6-5b7b8d8e9129
