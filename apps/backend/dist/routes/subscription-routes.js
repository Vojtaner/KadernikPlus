"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0933143f-5af8-59dd-9b61-c4407067468a")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const subscription_controller_1 = __importDefault(require("../infrastructure/controllers/subscription-controller"));
const express_1 = require("express");
const subscriptionRouter = (0, express_1.Router)();
subscriptionRouter.post("/", (0, make_express_callback_1.makeExpressCallback)(subscription_controller_1.default.addSubscriptionController));
subscriptionRouter.delete("/:id", (0, make_express_callback_1.makeExpressCallback)(subscription_controller_1.default.cancelSubscriptionController));
subscriptionRouter.get("/", (0, make_express_callback_1.makeExpressCallback)(subscription_controller_1.default.getSubscriptionController));
subscriptionRouter.post("/extend/:userId", (0, make_express_callback_1.makeExpressCallback)(subscription_controller_1.default.extendSubscriptionController));
exports.default = subscriptionRouter;
//# sourceMappingURL=subscription-routes.js.map
//# debugId=0933143f-5af8-59dd-9b61-c4407067468a
