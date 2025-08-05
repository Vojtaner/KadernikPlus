"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const services_routes_1 = __importDefault(require("./routes/services-routes"));
const team_member_routes_1 = __importDefault(require("./routes/team-member-routes"));
const team_1 = __importDefault(require("./routes/team"));
const procedure_routes_1 = __importDefault(require("./routes/procedure-routes"));
const log_routes_1 = __importDefault(require("./routes/log-routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = (0, getEnvVar_1.getEnvVar)("PORT") || 3000;
const jwtCheck = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: (0, getEnvVar_1.getEnvVar)("AUDIENCE"),
    issuerBaseURL: (0, getEnvVar_1.getEnvVar)("AUTH0_ISSUER_BASE_URL"),
    tokenSigningAlg: (0, getEnvVar_1.getEnvVar)("AUTH0_TOKE_SIGNING_ALG"),
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const x = jwtCheck;
console.log({
    jwt: x,
    audience: (0, getEnvVar_1.getEnvVar)("AUDIENCE"),
    issuerBaseURL: (0, getEnvVar_1.getEnvVar)("AUTH0_ISSUER_BASE_URL"),
    tokenSigningAlg: (0, getEnvVar_1.getEnvVar)("AUTH0_TOKE_SIGNING_ALG"),
});
app.get("/", (req, res) => {
    res.send("Hairdresser App Backend is running!");
});
app.use(jwtCheck);
app.use((0, ensureUserExistsMiddleware_1.default)(ensure_user_exists_1.default));
app.use("/api/visits", routes_1.visitRoutes);
app.use("/api/logs", log_routes_1.default);
app.use("/api/team-members", team_member_routes_1.default);
app.use("/api/team", team_1.default);
app.use("/api/procedures", procedure_routes_1.default);
app.use("/api/users", routes_1.userRoutes);
app.use("/api/clients", routes_1.clientRoutes);
app.use("/api/stock", routes_1.stockItemRoutes);
app.use("/api/services", services_routes_1.default);
app.use(errorHandler_1.default);
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
