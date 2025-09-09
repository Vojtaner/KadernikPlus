"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b2e4f495-15d1-54da-934e-db7a5bf7fc5d")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_payment_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-payment-repository"));
const createCreatePaymentUseCase = (dependencies) => ({
    execute: async (paymentData) => {
        return dependencies.paymentRepositoryDb.create(paymentData);
    },
});
const createPaymentUseCase = createCreatePaymentUseCase({
    paymentRepositoryDb: prisma_payment_repository_1.default,
});
exports.default = createPaymentUseCase;
//# sourceMappingURL=create-payment.js.map
//# debugId=b2e4f495-15d1-54da-934e-db7a5bf7fc5d
