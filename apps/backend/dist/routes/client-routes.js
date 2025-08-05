"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const client_controller_1 = __importDefault(require("../infrastructure/controllers/client-controller"));
const clientRoutes = (0, express_1.Router)();
clientRoutes.post("/", (0, make_express_callback_1.makeExpressCallback)(client_controller_1.default.addOrUpdateClientController));
clientRoutes.patch("/search", (0, make_express_callback_1.makeExpressCallback)(client_controller_1.default.findClientsController));
clientRoutes.get("/", (0, make_express_callback_1.makeExpressCallback)(client_controller_1.default.getAllClientsByUserIdController));
clientRoutes.get("/:clientId", (0, make_express_callback_1.makeExpressCallback)(client_controller_1.default.getClientByIdController));
exports.default = clientRoutes;
