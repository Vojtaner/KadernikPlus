import { makeExpressCallback } from "../adapters/express/make-express-callback";
import teamMemberController from "../infrastructure/controllers/team-member-controller";
import { Router } from "express";

const teamMemberRoutes = Router();

teamMemberRoutes.get(
  "/",
  makeExpressCallback(teamMemberController.getTeamMemberByUserIdController)
);
teamMemberRoutes.patch(
  "/:teamId",
  makeExpressCallback(teamMemberController.updateTeamMemberSkillController)
);

teamMemberRoutes.get(
  "/:teamId",
  makeExpressCallback(teamMemberController.getTeamMembersByTeamIdController)
);

teamMemberRoutes.post(
  "/",
  makeExpressCallback(teamMemberController.createTeamMemberController)
);

teamMemberRoutes.delete(
  "/",
  makeExpressCallback(teamMemberController.deleteTeamMemberController)
);

teamMemberRoutes.post(
  "/invitation",
  makeExpressCallback(teamMemberController.inviteOrSwitchTeamController)
);

export default teamMemberRoutes;
