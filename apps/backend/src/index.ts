import "./application/services/sentry/instrument";
import express from "express";
import Sentry from "./application/services/sentry/instrument";
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
// import errorHandler from "./utils/errorHandler";
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
// import { checkCors } from "./utils/checkCors";
// import { httpError } from "./adapters/express/httpError";

dotenv.config();

const app = express();

const PORT = getEnvVar("PORT") || 3000;
app.set("trust proxy", 1); //backend běží za proxy a express neduvěřuje, nyní ano chyba X-forwarded-future*
app.get("/debug", () => {
  throw new Error("Test Sentry");
});

app.get("/debug/prisma", async (req, res, next) => {
  try {
    const users = await prisma.user.create({
      data: { email: "vojtech.laurin@email.com", name: "Vojta" },
    });
    res.send("ok");
  } catch (err) {
    next(err);
  }
});

const jwtCheck = auth({
  audience: getEnvVar("AUDIENCE"),
  issuerBaseURL: getEnvVar("AUTH0_ISSUER_BASE_URL"),
  tokenSigningAlg: getEnvVar("AUTH0_TOKE_SIGNING_ALG"),
});

app.use(metricsMiddleware);

register.registerMetric(httpRequests);

app.use(cors());

// app.use(cors({ origin: checkCors, credentials: true }));
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

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userId = req.auth?.payload.sub || "test_user_id_context";

    Sentry.withScope((scope) => {
      if (userId) {
        scope.setUser({ id: userId });
      }

      scope.setContext("request", {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body,
      });

      Sentry.captureException(err);
    });

    let status = 500;
    // | Název                     | Popis                                                 | HTTP status |
    // | ------------------------- | ----------------------------------------------------- | ----------- |
    // | `NotFoundError`           | Resource neexistuje (DB záznam, route, soubor…)       | 404         |
    // | `ValidationError`         | Špatný vstup od uživatele (request body/query/params) | 400         |
    // | `UnauthorizedError`       | JWT chybí nebo je neplatný                            | 401         |
    // | `ForbiddenError`          | Uživateli chybí oprávnění                             | 403         |
    // | `ConflictError`           | Např. unikátní constraint v DB                        | 409         |
    // | `InternalServerError`     | Neočekávaná chyba                                     | 500         |
    // | `BadRequestError`         | Jiný typ špatného requestu                            | 400         |
    // | `TimeoutError`            | Externí API timeout / DB timeout                      | 504         |
    // | `ServiceUnavailableError` | Externí služba nedostupná                             | 503         |

    res
      .status(status)
      .json({ message: err.message || "Internal Server Error" });
  }
);

// app.use(Sentry.expressErrorHandler());

// app.use(errorHandler);

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
  console.log("Flushing Sentry events...");
  await Sentry.flush(2000);
  await prisma.$disconnect();
});
