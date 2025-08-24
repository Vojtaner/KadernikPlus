import express from "express";
import dotenv from "dotenv";
import {
  clientRoutes,
  userRoutes,
  visitRoutes,
  stockItemRoutes,
  stockAllowanceRoutes,
  logRoutes,
  procedureRoutes,
  serviceRoutes,
  teamMemberRoutes,
  teamRoutes,
} from "./routes";
import prisma from "./infrastructure/data/prisma/prisma";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import errorHandler from "./utils/errorHandler";
import ensureUserExistsMiddleware from "./adapters/express/ensureUserExistsMiddleware";
import ensureUserExistsUseCase from "./application/use-cases/user/ensure-user-exists";
import { getEnvVar } from "./utils/getEnvVar";
import subscriptionRouter from "./routes/subscription-routes";
import paymentRouter from "./routes/payment-routes";
import { makeExpressCallback } from "./adapters/express/make-express-callback";
import paymentController from "./infrastructure/controllers/payment-controller";

dotenv.config();

const app = express();
const PORT = getEnvVar("PORT") || 3000;

const jwtCheck = auth({
  audience: getEnvVar("AUDIENCE"),
  issuerBaseURL: getEnvVar("AUTH0_ISSUER_BASE_URL"),
  tokenSigningAlg: getEnvVar("AUTH0_TOKE_SIGNING_ALG"),
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Aplikace kadeřník plus je v provozu.");
});
app.post(
  "/api/payment/callback",
  makeExpressCallback(paymentController.updatePaymentStatusController)
);
app.use(jwtCheck);
app.use(ensureUserExistsMiddleware(ensureUserExistsUseCase));

app.use("/api/visits", visitRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/procedures", procedureRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/stock", stockItemRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/stock-allowance", stockAllowanceRoutes);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/payment", paymentRouter);

app.use(errorHandler);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database or start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("beforeExit", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from the database.");
});
