"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="99e37eda-2a6b-5e45-9fac-33b12e918138")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const createPaymentRepositoryDb = (prismaClient) => {
    return {
        create: async (paymentData) => {
            const payment = await prismaClient.payment.create({
                data: paymentData,
            });
            return payment;
        },
        updatePayment: async (data, id) => {
            if (!id && !data.refId) {
                throw new Error("Platbu nelze aktualizovat chybí ID nebo REFID.");
            }
            try {
                if (data.refId) {
                    const updatedPayment = await prisma_1.default.payment.update({
                        where: { refId: data.refId },
                        data,
                    });
                    return updatedPayment;
                }
                if (id) {
                    const updatedPayment = await prisma_1.default.payment.update({
                        where: { id },
                        data,
                    });
                    return updatedPayment;
                }
            }
            catch (error) {
                console.log("prismaPaymentRepositoryDb - updatePayment error", error);
                throw new Error("Platbu nelze aktualizovat.");
            }
        },
        findByExternalId: async (transactionId) => {
            const payment = await prismaClient.payment.findUnique({
                where: { transactionId },
            });
            return payment;
        },
    };
};
const paymentRepositoryDb = createPaymentRepositoryDb(prisma_1.default);
exports.default = paymentRepositoryDb;
//# sourceMappingURL=prisma-payment-repository.js.map
//# debugId=99e37eda-2a6b-5e45-9fac-33b12e918138
