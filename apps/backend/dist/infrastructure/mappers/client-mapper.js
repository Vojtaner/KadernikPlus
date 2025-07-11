"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapToDomainClient = (prismaClient) => {
    return {
        id: prismaClient.id,
        name: prismaClient.name,
        phone: prismaClient.phone,
        email: prismaClient.email,
        note: prismaClient.note,
        birthDate: prismaClient.birthDate,
    };
};
exports.default = mapToDomainClient;
