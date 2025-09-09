"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="44812cea-7c53-5a31-ae9e-4b79811b625b")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const index_1 = require("../infrastructure/controllers/index");
const logRoutes = (0, express_1.Router)();
logRoutes.get("/", (0, make_express_callback_1.makeExpressCallback)(index_1.logController.getAllLogsController));
exports.default = logRoutes;
//# sourceMappingURL=log-routes.js.map
//# debugId=44812cea-7c53-5a31-ae9e-4b79811b625b
