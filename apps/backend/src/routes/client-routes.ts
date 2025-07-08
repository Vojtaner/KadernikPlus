import { Router } from "express";
import { clientController } from "..";
import { makeExpressCallback } from "../utils/make-express-callback";

const clientRoutes = Router();

// clientRoutes.post(
//   "/",
//   makeExpressCallback(clientController.addClientController)
// );
// clientRoutes.get(
//   "/:id",
//   makeExpressCallback(clientController.getClientByIdController)
// );

export default clientRoutes;
