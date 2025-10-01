import "./application/services/sentry/instrument";
import initSentry from "./application/services/sentry/instrument";
import express from "express";
import dotenv from "dotenv";
import "./application/crons/anonymize-users";
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
import {
  httpRequests,
  metricsMiddleware,
  register,
} from "./application/services/prometheus/prometheus";
import invoiceRouter from "./routes/invoice-routes";
import rateLimiter from "./utils/rateLimiter";
import { checkCors } from "./utils/checkCors";

dotenv.config();

const Sentry = initSentry();
const app = express();

const PORT = getEnvVar("PORT") || 3000;

app.get("/debug", () => {
  throw new Error("Test Sentry");
});

const jwtCheck = auth({
  audience: getEnvVar("AUDIENCE"),
  issuerBaseURL: getEnvVar("AUTH0_ISSUER_BASE_URL"),
  tokenSigningAlg: getEnvVar("AUTH0_TOKE_SIGNING_ALG"),
});

app.use(metricsMiddleware);

register.registerMetric(httpRequests);

app.use(cors({ origin: checkCors, credentials: true }));

app.use(express.json());

app.get("/cors-origin-test", (req, res) => {
  res.json({ message: "CORS setup working ✅" });
});

app.use(rateLimiter);

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequests.inc({ method: req.method, status: res.statusCode });
  });
  next();
});
app.get("/", (req, res) => {
  res.send("Aplikace kadeřník plus je v provozu.");
});
app.options("/api/payment/callback", cors());

app.post(
  "/api/payment/callback",
  makeExpressCallback(paymentController.updatePushNotificationPaymentController)
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
app.use("/api/invoices", invoiceRouter);

Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log(
      `Connected to the database successfully! DATABASE_URL=${process.env.DATABASE_URL}`
    );

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
