"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const service_mapper_1 = __importDefault(require("../../../infrastructure/mappers/service-mapper"));
const createServiceRepositoryDb = (prismaServiceRepository) => {
    return {
        getAllServices: async (userId) => {
            const services = await prismaServiceRepository.service.findMany({
                where: { userId },
            });
            return services.map(service_mapper_1.default);
        },
        findByName: async (serviceName, userId) => {
            const service = await prismaServiceRepository.service.findUnique({
                where: {
                    userId_serviceName: {
                        userId,
                        serviceName,
                    },
                },
            });
            return service ? (0, service_mapper_1.default)(service) : null;
        },
        addService: async (serviceData) => {
            const newService = await prismaServiceRepository.service.create({
                data: {
                    serviceName: serviceData.serviceName,
                    basePrice: serviceData.basePrice,
                    user: {
                        connect: {
                            id: serviceData.userId,
                        },
                    },
                },
            });
            return (0, service_mapper_1.default)(newService);
        },
    };
};
const serviceRepositoryDb = createServiceRepositoryDb(prisma_1.default);
exports.default = serviceRepositoryDb;
