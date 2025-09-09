"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="70711834-0fc0-5593-8974-a63cd1c94977")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./application/services/sentry/instrument.js");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
const prisma_1 = __importDefault(require("./infrastructure/data/prisma/prisma"));
const cors_1 = __importDefault(require("cors"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const ensureUserExistsMiddleware_1 = __importDefault(require("./adapters/express/ensureUserExistsMiddleware"));
const ensure_user_exists_1 = __importDefault(require("./application/use-cases/user/ensure-user-exists"));
const getEnvVar_1 = require("./utils/getEnvVar");
const subscription_routes_1 = __importDefault(require("./routes/subscription-routes"));
const payment_routes_1 = __importDefault(require("./routes/payment-routes"));
const make_express_callback_1 = require("./adapters/express/make-express-callback");
const payment_controller_1 = __importDefault(require("./infrastructure/controllers/payment-controller"));
const sentry_1 = __importDefault(require("./application/services/sentry/sentry"));
const prometheus_1 = require("./application/services/prometheus/prometheus");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = (0, getEnvVar_1.getEnvVar)("PORT") || 3000;
const jwtCheck = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: (0, getEnvVar_1.getEnvVar)("AUDIENCE"),
    issuerBaseURL: (0, getEnvVar_1.getEnvVar)("AUTH0_ISSUER_BASE_URL"),
    tokenSigningAlg: (0, getEnvVar_1.getEnvVar)("AUTH0_TOKE_SIGNING_ALG"),
});
app.use(prometheus_1.metricsMiddleware);
prometheus_1.register.registerMetric(prometheus_1.httpRequests);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.on("finish", () => {
        prometheus_1.httpRequests.inc({ method: req.method, status: res.statusCode });
    });
    next();
});
app.get("/", (req, res) => {
    res.send("Aplikace kadeřník plus je v provozu.");
});
app.options("/api/payment/callback", (0, cors_1.default)());
app.post("/api/payment/callback", (0, make_express_callback_1.makeExpressCallback)(payment_controller_1.default.updatePushNotificationPaymentController));
app.use(jwtCheck);
app.use((0, ensureUserExistsMiddleware_1.default)(ensure_user_exists_1.default));
app.use("/api/visits", routes_1.visitRoutes);
app.use("/api/logs", routes_1.logRoutes);
app.use("/api/team-members", routes_1.teamMemberRoutes);
app.use("/api/team", routes_1.teamRoutes);
app.use("/api/procedures", routes_1.procedureRoutes);
app.use("/api/users", routes_1.userRoutes);
app.use("/api/clients", routes_1.clientRoutes);
app.use("/api/stock", routes_1.stockItemRoutes);
app.use("/api/services", routes_1.serviceRoutes);
app.use("/api/stock-allowance", routes_1.stockAllowanceRoutes);
app.use("/api/subscription", subscription_routes_1.default);
app.use("/api/payment", payment_routes_1.default);
sentry_1.default.setupExpressErrorHandler(app);
app.use(errorHandler_1.default);
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", prometheus_1.register.contentType);
    res.end(await prometheus_1.register.metrics());
});
const startServer = async () => {
    try {
        await prisma_1.default.$connect();
        console.log("Connected to the database successfully!");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to the database or start server:", error);
        process.exit(1);
    }
};
startServer();
process.on("beforeExit", async () => {
    await prisma_1.default.$disconnect();
    console.log("Disconnected from the database.");
});
//# sourceMappingURL=index.js.map
//# debugId=70711834-0fc0-5593-8974-a63cd1c94977
