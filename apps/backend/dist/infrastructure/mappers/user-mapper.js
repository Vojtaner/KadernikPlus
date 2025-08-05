"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapToDomainUser = (prismaUser) => {
    return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        authProvider: prismaUser.authProvider,
        createdAt: prismaUser.createdAt,
        lastLogin: prismaUser.lastLogin,
    };
};
exports.default = mapToDomainUser;
