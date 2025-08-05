"use strict";
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
