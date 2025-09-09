"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="4a11eb66-a935-551c-9bd0-793891a5e586")}catch(e){}}();

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
//# sourceMappingURL=user-mapper.js.map
//# debugId=4a11eb66-a935-551c-9bd0-793891a5e586
