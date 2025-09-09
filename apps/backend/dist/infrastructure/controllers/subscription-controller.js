"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6ffbcb43-2441-53e4-8aef-9845ad46bcec")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_subscription_1 = __importDefault(require("../../application/use-cases/subscription/add-subscription"));
const cancel_subscription_1 = __importDefault(require("../../application/use-cases/subscription/cancel-subscription"));
const get_subscription_by_user_id_1 = __importDefault(require("../../application/use-cases/subscription/get-subscription-by-user-id"));
const extend_subscription_1 = __importDefault(require("../../application/use-cases/subscription/extend-subscription"));
const createSubscriptionController = (dependencies) => {
    const addSubscriptionController = async (httpRequest) => {
        try {
            const paymentUrl = await dependencies.addSubscriptionUseCase.execute({
                ...httpRequest.body,
                userId: httpRequest.userId,
            });
            return { statusCode: 201, body: paymentUrl };
        }
        catch (error) {
            return { statusCode: 400, body: { error: error.message } };
        }
    };
    const extendSubscriptionController = async (httpRequest) => {
        const { userId } = httpRequest.params;
        const { extraDays } = httpRequest.body;
        const sub = await dependencies.extendSubscriptionUseCase.execute(userId, extraDays);
        return { statusCode: 200, body: sub };
    };
    const cancelSubscriptionController = async (httpRequest) => {
        const { id } = httpRequest.params;
        const sub = await dependencies.cancelSubscriptionUseCase.execute(id);
        return { statusCode: 200, body: sub };
    };
    const getSubscriptionController = async (httpRequest) => {
        const userId = httpRequest.userId;
        const sub = await dependencies.getSubscriptionUseCase.execute(userId);
        return { statusCode: 200, body: sub };
    };
    return {
        addSubscriptionController,
        cancelSubscriptionController,
        getSubscriptionController,
        extendSubscriptionController,
    };
};
const subscriptionController = createSubscriptionController({
    addSubscriptionUseCase: add_subscription_1.default,
    cancelSubscriptionUseCase: cancel_subscription_1.default,
    getSubscriptionUseCase: get_subscription_by_user_id_1.default,
    extendSubscriptionUseCase: extend_subscription_1.default,
});
exports.default = subscriptionController;
//# sourceMappingURL=subscription-controller.js.map
//# debugId=6ffbcb43-2441-53e4-8aef-9845ad46bcec
