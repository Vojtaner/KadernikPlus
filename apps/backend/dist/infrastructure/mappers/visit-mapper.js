"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapToDomainVisit = (prismaVisit) => {
    return {
        id: prismaVisit.id,
        clientId: prismaVisit.clientId,
        userId: prismaVisit.userId,
        date: prismaVisit.date,
        note: prismaVisit.note,
        paidPrice: prismaVisit.paidPrice,
        // createdAt and updatedAt are typically not part of core domain entity for simple CRUD
    };
};
exports.default = mapToDomainVisit;
