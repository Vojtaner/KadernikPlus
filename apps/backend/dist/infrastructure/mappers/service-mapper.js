"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="3a098953-0cc3-55c9-88be-14f5c5bebe97")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const mapToDomainService = (prismaServiceItem) => {
    return {
        id: prismaServiceItem.id,
        serviceName: prismaServiceItem.serviceName,
        basePrice: prismaServiceItem.basePrice.toNumber(),
        teamId: prismaServiceItem.teamId,
    };
};
exports.default = mapToDomainService;
//# sourceMappingURL=service-mapper.js.map
//# debugId=3a098953-0cc3-55c9-88be-14f5c5bebe97
