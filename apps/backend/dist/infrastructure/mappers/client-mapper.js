"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapToDomainClient = (prismaClient) => {
    return {
        id: prismaClient.id,
        firstName: prismaClient.firstName,
        lastName: prismaClient.lastName,
        phone: prismaClient.phone,
        note: prismaClient.note,
        deposit: prismaClient.deposit ?? false,
    };
};
exports.default = mapToDomainClient;
