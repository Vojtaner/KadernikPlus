import { Router } from "express";
import { makeExpressCallback } from "../utils/make-express-callback";
import { UserController } from "../infrastructure/controllers/index";

const userRoutes = Router();

userRoutes.post("/", makeExpressCallback(UserController.addUserController));
userRoutes.get(
  "/:id",
  makeExpressCallback(UserController.getUserByIdController)
);

export default userRoutes;
