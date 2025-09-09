"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e7939bf6-08b1-56cd-870f-1c1077d049d0")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const service_controller_1 = __importDefault(require("../infrastructure/controllers/service-controller"));
const serviceRoutes = (0, express_1.Router)();
serviceRoutes.post("/", (0, make_express_callback_1.makeExpressCallback)(service_controller_1.default.addOrUpdateServiceController));
serviceRoutes.get("/", (0, make_express_callback_1.makeExpressCallback)(service_controller_1.default.getAllServicesController));
exports.default = serviceRoutes;
//# sourceMappingURL=services-routes.js.map
//# debugId=e7939bf6-08b1-56cd-870f-1c1077d049d0
