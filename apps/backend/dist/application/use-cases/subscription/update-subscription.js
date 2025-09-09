"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="5e989229-5acb-56c7-a4cc-1e2a9321f57c")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_subscription_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-subscription-repository"));
const createUpdateSubscriptionUseCase = (dependencies) => ({
    execute: async (id, data) => {
        const updatedSubscription = await dependencies.subscriptionRepositoryDb.update(id, data);
        return updatedSubscription;
    },
});
const updateSubscriptionUseCase = createUpdateSubscriptionUseCase({
    subscriptionRepositoryDb: prisma_subscription_repository_1.default,
});
exports.default = updateSubscriptionUseCase;
//# sourceMappingURL=update-subscription.js.map
//# debugId=5e989229-5acb-56c7-a4cc-1e2a9321f57c
