"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7482ea9a-b286-5fc7-b5fe-4d8529e9bc0a")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logController = exports.UserController = exports.VisitController = exports.ClientController = exports.StockItemController = void 0;
var stock_item_controller_1 = require("./stock-item-controller");
Object.defineProperty(exports, "StockItemController", { enumerable: true, get: function () { return __importDefault(stock_item_controller_1).default; } });
var client_controller_1 = require("./client-controller");
Object.defineProperty(exports, "ClientController", { enumerable: true, get: function () { return __importDefault(client_controller_1).default; } });
var visit_controller_1 = require("./visit-controller");
Object.defineProperty(exports, "VisitController", { enumerable: true, get: function () { return __importDefault(visit_controller_1).default; } });
var user_controller_1 = require("./user-controller");
Object.defineProperty(exports, "UserController", { enumerable: true, get: function () { return __importDefault(user_controller_1).default; } });
var log_controller_1 = require("./log-controller");
Object.defineProperty(exports, "logController", { enumerable: true, get: function () { return __importDefault(log_controller_1).default; } });
//# sourceMappingURL=index.js.map
//# debugId=7482ea9a-b286-5fc7-b5fe-4d8529e9bc0a
