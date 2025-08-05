"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const make_express_callback_1 = require("../utils/make-express-callback");
const client_controller_1 = __importDefault(require("../infrastructure/controllers/client-controller"));
const clientRoutes = (0, express_1.Router)();
clientRoutes.post("/", (0, make_express_callback_1.makeExpressCallback)(client_controller_1.default.addClientController));
clientRoutes.get("/:id", (0, make_express_callback_1.makeExpressCallback)(client_controller_1.default.getClientByIdController));
exports.default = clientRoutes;
