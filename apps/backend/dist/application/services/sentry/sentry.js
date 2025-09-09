"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a3ad6e73-844b-5c2e-a69a-07e52f028a67")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getEnvVar_1 = require("../../../utils/getEnvVar");
const node_1 = __importDefault(require("@sentry/node"));
node_1.default.init({
    dsn: (0, getEnvVar_1.getEnvVar)("SENTRY_DSN"),
    sendDefaultPii: true,
});
exports.default = node_1.default;
//# sourceMappingURL=sentry.js.map
//# debugId=a3ad6e73-844b-5c2e-a69a-07e52f028a67
