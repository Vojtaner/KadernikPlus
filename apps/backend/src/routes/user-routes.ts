import { Router } from "express";
import { makeExpressCallback } from "../adapters/express/make-express-callback";
import { UserController } from "../infrastructure/controllers/index";

const userRoutes = Router();

userRoutes.post("/", makeExpressCallback(UserController.addUserController));
userRoutes.put("/", makeExpressCallback(UserController.updateUserController));
userRoutes.get("/", makeExpressCallback(UserController.getUserByIdController));

export default userRoutes;
