"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d02ac1a5-c902-53dc-a925-04c68bc6f290")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitNotFoundError = VisitNotFoundError;
// import mapToDomainVisit from "../../../infrastructure/mappers/visit-mapper";
const prisma_visit_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-visit-repository"));
function VisitNotFoundError(id) {
    const error = new Error(`Visit with ID '${id}' not found.`);
    error.name = "VisitNotFoundError";
    return error;
}
const createGetVisitByIdUseCase = (dependencies) => {
    return {
        //
        execute: async (visitId) => {
            const visit = await dependencies.visitRepositoryDb.findById(visitId);
            if (!visit) {
                throw VisitNotFoundError(visitId);
            }
            return visit ?? null;
        },
    };
};
const getVisitByIdUseCase = createGetVisitByIdUseCase({ visitRepositoryDb: prisma_visit_repository_1.default });
exports.default = getVisitByIdUseCase;
//# sourceMappingURL=get-visit-by-id.js.map
//# debugId=d02ac1a5-c902-53dc-a925-04c68bc6f290
