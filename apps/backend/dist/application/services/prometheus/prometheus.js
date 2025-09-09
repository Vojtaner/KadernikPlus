"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b48730ad-3aba-515f-badf-fc576e488ade")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequests = exports.register = exports.metricsMiddleware = void 0;
const prom_client_1 = require("prom-client");
const express_prom_bundle_1 = __importDefault(require("express-prom-bundle"));
const metricsMiddleware = (0, express_prom_bundle_1.default)({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    customLabels: {
        project_name: "hello_world",
        project_type: "test_metrics_labels",
    },
    promClient: {
        collectDefaultMetrics: {},
    },
});
exports.metricsMiddleware = metricsMiddleware;
const register = new prom_client_1.Registry();
exports.register = register;
const httpRequests = new prom_client_1.Counter({
    name: "http_requests_total",
    help: "Počet HTTP requestů",
    labelNames: ["method", "status"],
});
exports.httpRequests = httpRequests;
//# sourceMappingURL=prometheus.js.map
//# debugId=b48730ad-3aba-515f-badf-fc576e488ade
