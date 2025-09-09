"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e41af946-e406-5eeb-80d2-9bca88fbb80e")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_payment_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-payment-repository"));
const createUpdatePaymentUseCase = (dependencies) => ({
    execute: async (data, id) => {
        return await dependencies.paymentRepositoryDb.updatePayment(data, id);
    },
});
const updatePaymentUseCase = createUpdatePaymentUseCase({
    paymentRepositoryDb: prisma_payment_repository_1.default,
});
exports.default = updatePaymentUseCase;
//# sourceMappingURL=update-payment.js.map
//# debugId=e41af946-e406-5eeb-80d2-9bca88fbb80e
