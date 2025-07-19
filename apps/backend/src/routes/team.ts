import teamController from "../infrastructure/controllers/team-controller";
import { makeExpressCallback } from "../adapters/express/make-express-callback";
import teamMemberController from "../infrastructure/controllers/team-member-controller";
import { Router } from "express";

const teamRoutes = Router();

teamRoutes.get(
  "/:teamId",
  makeExpressCallback(teamController.getTeamController)
);
// teamRoutes.post(
//   "/",
//   makeExpressCallback(teamController.createTeamController)
// );

export default teamRoutes;
