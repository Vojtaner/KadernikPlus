"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6d735052-938e-579e-821f-60fd45fa2148")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_subscription_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-subscription-repository"));
const createCancelSubscriptionUseCase = (dependencies) => {
    return {
        execute: async (id) => {
            return dependencies.subscriptionRepositoryDb.cancel(id);
        },
    };
};
const cancelSubscriptionUseCase = createCancelSubscriptionUseCase({
    subscriptionRepositoryDb: prisma_subscription_repository_1.default,
});
exports.default = cancelSubscriptionUseCase;
//# sourceMappingURL=cancel-subscription.js.map
//# debugId=6d735052-938e-579e-821f-60fd45fa2148
