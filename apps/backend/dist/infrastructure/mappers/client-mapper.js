"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ef1bd4a6-4d71-5b24-aada-4b38d5b95b8a")}catch(e){}}();

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
//# sourceMappingURL=client-mapper.js.map
//# debugId=ef1bd4a6-4d71-5b24-aada-4b38d5b95b8a
