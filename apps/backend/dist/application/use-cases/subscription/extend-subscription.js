"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="71e075a0-b2af-5324-94ae-02a4a01683b4")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_subscription_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-subscription-repository"));
const createExtendSubscriptionUseCase = (dependencies) => {
    return {
        execute: async (userId, extraDays) => {
            const active = await dependencies.subscriptionRepositoryDb.findActiveByUserId(userId);
            if (!active) {
                return null;
            }
            if (!active.endDate) {
                throw new Error("Předplatné nemá konec datumu platnosti.");
            }
            const newEndDate = new Date(active.endDate);
            newEndDate.setDate(newEndDate.getDate() + extraDays);
            return dependencies.subscriptionRepositoryDb.update(active.id, {
                endDate: newEndDate,
            });
        },
    };
};
const extendSubscriptionUseCase = createExtendSubscriptionUseCase({
    subscriptionRepositoryDb: prisma_subscription_repository_1.default,
});
exports.default = extendSubscriptionUseCase;
//# sourceMappingURL=extend-subscription.js.map
//# debugId=71e075a0-b2af-5324-94ae-02a4a01683b4
