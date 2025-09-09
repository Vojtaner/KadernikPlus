"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="29746cf7-4a9e-547b-8a9f-eccdbdd03e07")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const payment_controller_1 = __importDefault(require("../infrastructure/controllers/payment-controller"));
const express_1 = require("express");
const paymentRouter = (0, express_1.Router)();
paymentRouter.post("/callback", (0, make_express_callback_1.makeExpressCallback)(payment_controller_1.default.updatePushNotificationPaymentController));
exports.default = paymentRouter;
//# sourceMappingURL=payment-routes.js.map
//# debugId=29746cf7-4a9e-547b-8a9f-eccdbdd03e07
