"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0942b187-49ea-5b4b-bc47-1e6abd7088e6")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_service_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-service-repository"));
const createGetAllServicesUseCase = (dependencies) => {
    return {
        execute: async (userId) => {
            const services = await dependencies.serviceRepositoryDb.getAllServices(userId);
            return services;
        },
    };
};
const getAllServicesUseCase = createGetAllServicesUseCase({
    serviceRepositoryDb: prisma_service_repository_1.default,
});
exports.default = getAllServicesUseCase;
//# sourceMappingURL=get-all-services.js.map
//# debugId=0942b187-49ea-5b4b-bc47-1e6abd7088e6
