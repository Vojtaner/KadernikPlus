"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b948ede2-1bf6-51ff-b76b-e2aa8e0a0fee")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_payment_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-payment-repository"));
const prisma_subscription_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-subscription-repository"));
const createPushNotificationPaymentUseCase = (dependencies) => ({
    execute: async (data, id) => {
        try {
            const updatedPayment = await dependencies.paymentRepositoryDb.updatePayment({
                transactionId: data.transactionId,
                status: data.status,
                refId: Number(data.refId),
            });
            const now = new Date();
            const plus30DaysDate = new Date(now);
            plus30DaysDate.setDate(now.getDate() + 30);
            if (updatedPayment && updatedPayment.status === "PAID") {
                const updatedSubscription = await dependencies.subscriptionRepositoryDb.update(updatedPayment.subscriptionId, {
                    status: "ACTIVE",
                    startDate: now,
                    endDate: plus30DaysDate,
                });
                return updatedSubscription;
            }
        }
        catch (error) {
            console.log("createPushNotificationPaymentUseCase", error);
            throw new Error("Platbu se nepovedlo zpracovat.");
        }
    },
});
const updatePushNotificationPaymentUseCase = createPushNotificationPaymentUseCase({
    paymentRepositoryDb: prisma_payment_repository_1.default,
    subscriptionRepositoryDb: prisma_subscription_repository_1.default,
});
exports.default = updatePushNotificationPaymentUseCase;
//# sourceMappingURL=push-notification-payment.js.map
//# debugId=b948ede2-1bf6-51ff-b76b-e2aa8e0a0fee
