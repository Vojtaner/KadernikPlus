"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitRoutes = exports.userRoutes = exports.stockItemRoutes = exports.clientRoutes = void 0;
var client_routes_1 = require("./client-routes");
Object.defineProperty(exports, "clientRoutes", { enumerable: true, get: function () { return __importDefault(client_routes_1).default; } });
var stock_item_routes_1 = require("./stock-item-routes");
Object.defineProperty(exports, "stockItemRoutes", { enumerable: true, get: function () { return __importDefault(stock_item_routes_1).default; } });
var user_routes_1 = require("./user-routes");
Object.defineProperty(exports, "userRoutes", { enumerable: true, get: function () { return __importDefault(user_routes_1).default; } });
var visit_routes_1 = require("./visit-routes");
Object.defineProperty(exports, "visitRoutes", { enumerable: true, get: function () { return __importDefault(visit_routes_1).default; } });
