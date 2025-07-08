import { Router } from "express";
import { makeExpressCallback } from "../utils/make-express-callback";
import { userController } from "..";

const userRoutes = Router();

// userRoutes.post("/", makeExpressCallback(userController.addUserController));
// userRoutes.get(
//   "/:id",
//   makeExpressCallback(userController.getUserByIdController)
// );

export default userRoutes;
