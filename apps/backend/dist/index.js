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
const ensureUserExists_1 = require("./utils/ensureUserExists");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const jwtCheck = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: "http://localhost:3021",
    issuerBaseURL: "https://dev-ri7i8tb9.us.auth0.com/",
    tokenSigningAlg: "RS256",
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hairdresser App Backend is running!");
});
app.use(jwtCheck);
app.use((0, ensureUserExists_1.ensureUserExists)(prisma_1.default));
app.use("/api/visits", routes_1.visitRoutes);
app.use("/api/users", routes_1.userRoutes);
app.use("/api/clients", routes_1.clientRoutes);
app.use("/api/stock-items", routes_1.stockItemRoutes);
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
