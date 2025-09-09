"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9812af3c-43b9-5667-a2bf-bb7a40e8c03c")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoutes = exports.procedureRoutes = exports.teamRoutes = exports.teamMemberRoutes = exports.logRoutes = exports.stockAllowanceRoutes = exports.visitRoutes = exports.userRoutes = exports.stockItemRoutes = exports.clientRoutes = void 0;
var client_routes_1 = require("./client-routes");
Object.defineProperty(exports, "clientRoutes", { enumerable: true, get: function () { return __importDefault(client_routes_1).default; } });
var stock_item_routes_1 = require("./stock-item-routes");
Object.defineProperty(exports, "stockItemRoutes", { enumerable: true, get: function () { return __importDefault(stock_item_routes_1).default; } });
var user_routes_1 = require("./user-routes");
Object.defineProperty(exports, "userRoutes", { enumerable: true, get: function () { return __importDefault(user_routes_1).default; } });
var visit_routes_1 = require("./visit-routes");
Object.defineProperty(exports, "visitRoutes", { enumerable: true, get: function () { return __importDefault(visit_routes_1).default; } });
var stock_allowance_routes_1 = require("./stock-allowance-routes");
Object.defineProperty(exports, "stockAllowanceRoutes", { enumerable: true, get: function () { return __importDefault(stock_allowance_routes_1).default; } });
var log_routes_1 = require("./log-routes");
Object.defineProperty(exports, "logRoutes", { enumerable: true, get: function () { return __importDefault(log_routes_1).default; } });
var team_member_routes_1 = require("./team-member-routes");
Object.defineProperty(exports, "teamMemberRoutes", { enumerable: true, get: function () { return __importDefault(team_member_routes_1).default; } });
var team_1 = require("./team");
Object.defineProperty(exports, "teamRoutes", { enumerable: true, get: function () { return __importDefault(team_1).default; } });
var procedure_routes_1 = require("./procedure-routes");
Object.defineProperty(exports, "procedureRoutes", { enumerable: true, get: function () { return __importDefault(procedure_routes_1).default; } });
var services_routes_1 = require("./services-routes");
Object.defineProperty(exports, "serviceRoutes", { enumerable: true, get: function () { return __importDefault(services_routes_1).default; } });
//# sourceMappingURL=index.js.map
//# debugId=9812af3c-43b9-5667-a2bf-bb7a40e8c03c
