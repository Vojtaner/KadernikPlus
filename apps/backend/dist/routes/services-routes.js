"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const service_controller_1 = __importDefault(require("../infrastructure/controllers/service-controller"));
const serviceRoutes = (0, express_1.Router)();
serviceRoutes.post("/", (0, make_express_callback_1.makeExpressCallback)(service_controller_1.default.addServiceController));
serviceRoutes.get("/", (0, make_express_callback_1.makeExpressCallback)(service_controller_1.default.getAllServicesController));
exports.default = serviceRoutes;
