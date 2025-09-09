"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="bae031c6-105a-5d43-b0bd-92fe18bb5f2d")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_service_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-service-repository"));
const prisma_log_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-log-repository"));
const prisma_team_member_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-team-member-repository"));
class ServiceAlreadyExistsError extends Error {
    constructor(name) {
        super(`Service '${name}' already exists.`);
        this.name = "ServiceAlreadyExistsError";
    }
}
const createAddOrUpdateServiceUseCase = (dependencies) => {
    return {
        execute: async (serviceData) => {
            let action = "create";
            let serviceId;
            let message = "";
            const newOrUpdatedService = await dependencies.serviceRepositoryDb.addOrUpdate(serviceData);
            if (serviceData.id) {
                action = "update";
                serviceId = serviceData.id;
                message = `Upravená služba ${serviceData.serviceName}`;
            }
            else {
                serviceId = newOrUpdatedService.id;
                message = `Vytvořena služba ${newOrUpdatedService.serviceName}`;
            }
            const teamMember = await dependencies.teamMemberRepositoryDb.findUniqueMember(serviceData.userId);
            if (!teamMember) {
                throw Error("Chybí team id.");
            }
            await dependencies.logRepositoryDb.log({
                userId: serviceData.userId,
                action,
                entityType: "service",
                entityId: serviceId,
                message,
                metadata: { input: serviceData },
                teamId: teamMember?.teamId,
            });
            return newOrUpdatedService;
        },
    };
};
const addOrUpdateServiceUseCase = createAddOrUpdateServiceUseCase({
    serviceRepositoryDb: prisma_service_repository_1.default,
    logRepositoryDb: prisma_log_repository_1.default,
    teamMemberRepositoryDb: prisma_team_member_repository_1.default,
});
exports.default = addOrUpdateServiceUseCase;
//# sourceMappingURL=add-or-update-service.js.map
//# debugId=bae031c6-105a-5d43-b0bd-92fe18bb5f2d
