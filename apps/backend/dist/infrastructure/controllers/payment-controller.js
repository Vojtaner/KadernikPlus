"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d03142f9-9780-570f-978c-64034fce9dfc")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentController = void 0;
const create_payment_1 = __importDefault(require("../../application/use-cases/payment/create-payment"));
const push_notification_payment_1 = __importDefault(require("../../application/use-cases/payment/push-notification-payment"));
const createPaymentController = (dependencies) => {
    const updatePushNotificationPaymentController = async (httpRequest) => {
        const data = httpRequest.body;
        const paymentData = {
            refId: Number(data.refId),
            transactionId: data.transId,
            status: data.status,
        };
        try {
            const payment = await dependencies.updatePushNotificationPaymentUseCase.execute(paymentData);
            return { statusCode: 200, message: "OK" };
        }
        catch (error) {
            throw new Error("Platbu se nepovedlo aktualizovat.");
        }
    };
    return {
        createPaymentController: exports.createPaymentController,
        updatePushNotificationPaymentController,
    };
};
exports.createPaymentController = createPaymentController;
const paymentController = (0, exports.createPaymentController)({
    createPaymentUseCase: create_payment_1.default,
    updatePushNotificationPaymentUseCase: push_notification_payment_1.default,
});
exports.default = paymentController;
//# sourceMappingURL=payment-controller.js.map
//# debugId=d03142f9-9780-570f-978c-64034fce9dfc
