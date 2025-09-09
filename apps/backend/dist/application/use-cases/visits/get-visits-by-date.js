"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="76d9945d-5427-53b5-8b27-9854e5011db5")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetVisitsByDatesUseCase = createGetVisitsByDatesUseCase;
const prisma_visit_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-visit-repository"));
function createGetVisitsByDatesUseCase(dependencies) {
    return {
        execute: async (queryData) => {
            const visits = await dependencies.visitRepositoryDb.findByDate(queryData);
            return visits;
        },
    };
}
const getVisitsByDatesUseCase = createGetVisitsByDatesUseCase({
    visitRepositoryDb: prisma_visit_repository_1.default,
});
exports.default = getVisitsByDatesUseCase;
//# sourceMappingURL=get-visits-by-date.js.map
//# debugId=76d9945d-5427-53b5-8b27-9854e5011db5
