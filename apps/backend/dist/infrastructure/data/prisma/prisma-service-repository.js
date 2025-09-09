"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a924fb0a-7756-592a-8d86-bb53adb553d5")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const prisma_team_member_repository_1 = __importDefault(require("./prisma-team-member-repository"));
const createServiceRepositoryDb = (prismaServiceRepository) => {
    return {
        getAllServices: async (userId) => {
            const services = await prismaServiceRepository.service.findMany({
                where: { userId },
            });
            return services;
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
            return service ?? null;
        },
        addOrUpdate: async (serviceData) => {
            const { id: serviceId, userId } = serviceData;
            if (serviceId) {
                const existingService = await prismaServiceRepository.service.findFirst({
                    where: { id: serviceId },
                });
                if (existingService) {
                    const { userId, id, ...updateFields } = serviceData;
                    const updatedService = await prismaServiceRepository.service.update({
                        where: { id: serviceId },
                        data: { ...updateFields },
                    });
                    return updatedService;
                }
            }
            const teamMember = await prisma_team_member_repository_1.default.findUniqueMember(userId);
            if (!teamMember) {
                throw Error("Chybí teamId nelze upravit službu.");
            }
            if (!serviceData.serviceName) {
                throw new Error("Zadejte název služby.");
            }
            const newService = await prismaServiceRepository.service.create({
                data: {
                    serviceName: serviceData.serviceName,
                    basePrice: serviceData.basePrice,
                    user: { connect: { id: serviceData.userId } },
                },
            });
            return newService;
        },
    };
};
const serviceRepositoryDb = createServiceRepositoryDb(prisma_1.default);
exports.default = serviceRepositoryDb;
//# sourceMappingURL=prisma-service-repository.js.map
//# debugId=a924fb0a-7756-592a-8d86-bb53adb553d5
