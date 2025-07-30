import { Router } from "express";
import { makeExpressCallback } from "../adapters/express/make-express-callback";
import { logController } from "../infrastructure/controllers/index";

const logRoutes = Router();

logRoutes.get("/", makeExpressCallback(logController.getAllLogsController));

export default logRoutes;
