"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const index_1 = require("../infrastructure/controllers/index");
const logRoutes = (0, express_1.Router)();
logRoutes.get("/", (0, make_express_callback_1.makeExpressCallback)(index_1.logController.getAllLogsController));
exports.default = logRoutes;
