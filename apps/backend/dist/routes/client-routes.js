"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2289b5a9-7476-56ea-9233-752a3f3e1b4a")}catch(e){}}();

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
//# sourceMappingURL=client-routes.js.map
//# debugId=2289b5a9-7476-56ea-9233-752a3f3e1b4a
