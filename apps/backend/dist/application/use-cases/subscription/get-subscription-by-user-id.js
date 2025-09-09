"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="326ec296-ed80-58de-acc0-c641b0a41e3c")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_subscription_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-subscription-repository"));
const createGetSubscriptionUseCase = (dependencies) => {
    return {
        execute: async (userId) => {
            return dependencies.subscriptionRepositoryDb.findByUserId(userId);
        },
    };
};
const getSubscriptionUseCase = createGetSubscriptionUseCase({
    subscriptionRepositoryDb: prisma_subscription_repository_1.default,
});
exports.default = getSubscriptionUseCase;
//# sourceMappingURL=get-subscription-by-user-id.js.map
//# debugId=326ec296-ed80-58de-acc0-c641b0a41e3c
