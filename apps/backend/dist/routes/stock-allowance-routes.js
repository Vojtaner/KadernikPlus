"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6831d0c7-76e0-5f71-9d63-2e39c3cd5f72")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const stock_allowance_controller_1 = __importDefault(require("../infrastructure/controllers/stock-allowance-controller"));
const express_1 = require("express");
const stockAllowanecRoutes = (0, express_1.Router)();
stockAllowanecRoutes.get("/:teamId", (0, make_express_callback_1.makeExpressCallback)(stock_allowance_controller_1.default.getAllStockAllowancesByTeamIdController));
exports.default = stockAllowanecRoutes;
//# sourceMappingURL=stock-allowance-routes.js.map
//# debugId=6831d0c7-76e0-5f71-9d63-2e39c3cd5f72
