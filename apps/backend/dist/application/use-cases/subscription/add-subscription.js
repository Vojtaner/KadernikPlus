"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="57db84b4-a94c-56df-8eb7-582d1d563296")}catch(e){}}();

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require(".prisma/client");
const prisma_subscription_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-subscription-repository"));
const create_payment_1 = __importDefault(require("../payment/create-payment"));
const comgatePaymentApi_1 = __importStar(require("../../services/comgate/comgatePaymentApi"));
const prisma_user_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-user-repository"));
const auth0ManagementApi_1 = require("../../../application/services/auth0/auth0ManagementApi");
const update_payment_1 = __importDefault(require("../payment/update-payment"));
const createAddSubscriptionUseCase = (dependencies) => ({
    execute: async (data) => {
        const existingSubscription = await dependencies.subscriptionRepositoryDb.findByUserId(data.userId);
        if (existingSubscription && existingSubscription.status === "ACTIVE") {
            throw new Error("Uživatel už má platné členství.");
        }
        const user = await dependencies.userRepositoryDb.findById(data.userId);
        if (!user) {
            throw new Error("Uživatele se nepovedlo najít.");
        }
        const managementApiData = await dependencies.auth0ManagementApi.users.get({
            id: data.userId,
        });
        if (!managementApiData) {
            throw new Error("Nepovedlo se načíst Auth0 data.");
        }
        const newSubscription = await dependencies.subscriptionRepositoryDb.add({
            ...data,
            status: "PENDING",
        });
        const newPayment = await dependencies.createPaymentUseCase.execute({
            parentId: "",
            subscriptionId: newSubscription.id,
            amount: new client_1.Prisma.Decimal(data.price),
            currency: data.currency || "CZK",
            provider: "comgate",
            status: "PENDING",
            refId: (0, comgatePaymentApi_1.generate8DigitNumber)(),
            transactionId: (0, comgatePaymentApi_1.generate8DigitNumber)().toString(),
        });
        const comgatePaymentData = await dependencies.comgatePaymentApi.createPayment({
            price: Number(newPayment.amount),
            currency: newPayment.currency,
            email: user.email,
            refId: newPayment.refId.toString(),
            fullName: user.name,
            label: `Předplatné typu - ${newSubscription.plan}`,
            phone: managementApiData.data.phone_number,
        });
        if (comgatePaymentData) {
            const payment = await dependencies.updatePaymentUseCase.execute({
                transactionId: comgatePaymentData.transId,
            }, newPayment.id);
        }
        return comgatePaymentData;
    },
});
const addSubscriptionUseCase = createAddSubscriptionUseCase({
    subscriptionRepositoryDb: prisma_subscription_repository_1.default,
    userRepositoryDb: prisma_user_repository_1.default,
    createPaymentUseCase: create_payment_1.default,
    comgatePaymentApi: comgatePaymentApi_1.default,
    auth0ManagementApi: auth0ManagementApi_1.auth0ManagementApi,
    updatePaymentUseCase: update_payment_1.default,
});
exports.default = addSubscriptionUseCase;
//# sourceMappingURL=add-subscription.js.map
//# debugId=57db84b4-a94c-56df-8eb7-582d1d563296
