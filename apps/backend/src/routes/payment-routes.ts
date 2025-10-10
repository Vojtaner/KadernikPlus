import { makeExpressCallback } from "../adapters/express/make-express-callback";
import paymentController from "../infrastructure/controllers/payment-controller";
import { Router } from "express";

const paymentRouter = Router();

paymentRouter.post(
  "/callback",
  makeExpressCallback(paymentController.updatePushNotificationPaymentController)
);
paymentRouter.post(
  "/import",
  makeExpressCallback(paymentController.createImportPaymentController)
);
paymentRouter.get(
  "/",
  makeExpressCallback(paymentController.getPaymentByRefIdController)
);

export default paymentRouter;
