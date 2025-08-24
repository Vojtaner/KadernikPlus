import { makeExpressCallback } from "../adapters/express/make-express-callback";
import subscriptionController from "../infrastructure/controllers/subscription-controller";
import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.post(
  "/",
  makeExpressCallback(subscriptionController.addSubscriptionController)
);

subscriptionRouter.delete(
  "/:id",
  makeExpressCallback(subscriptionController.cancelSubscriptionController)
);

subscriptionRouter.get(
  "/",
  makeExpressCallback(subscriptionController.getSubscriptionController)
);

subscriptionRouter.post(
  "/extend/:userId",
  makeExpressCallback(subscriptionController.extendSubscriptionController)
);

export default subscriptionRouter;
