"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_service_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-service-repository"));
class ServiceAlreadyExistsError extends Error {
    constructor(serviceName) {
        super(`Service with name '${serviceName}' already exists.`);
        this.name = "ServiceAlreadyExistsError";
    }
}
const createAddServiceUseCase = (dependencies) => {
    return {
        execute: async (serviceData) => {
            if (serviceData.serviceName) {
                const existingService = await dependencies.serviceRepositoryDb.findByName(serviceData.serviceName, serviceData.userId);
                if (existingService) {
                    throw new ServiceAlreadyExistsError(serviceData.serviceName);
                }
            }
            const newService = await dependencies.serviceRepositoryDb.addService(serviceData);
            return newService;
        },
    };
};
const addServiceUseCase = createAddServiceUseCase({ serviceRepositoryDb: prisma_service_repository_1.default });
exports.default = addServiceUseCase;
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c67fc4a6-f9e2-5fa9-b9da-961415e7a042")}catch(e){}}();
//# debugId=c67fc4a6-f9e2-5fa9-b9da-961415e7a042
