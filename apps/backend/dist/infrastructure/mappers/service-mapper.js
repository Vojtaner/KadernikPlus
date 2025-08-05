"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapToDomainService = (prismaServiceItem) => {
    return {
        id: prismaServiceItem.id,
        serviceName: prismaServiceItem.serviceName,
        basePrice: prismaServiceItem.basePrice.toNumber(),
    };
};
exports.default = mapToDomainService;
