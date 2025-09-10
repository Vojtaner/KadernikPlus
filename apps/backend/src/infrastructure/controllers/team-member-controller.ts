import { ControllerFunction } from "@/adapters/express/make-express-callback";
import createTeamMemberUseCase, {
  CreateTeamMemberUseCaseType,
} from "../../application/use-cases/team-member/create-team-member";
import getTeamMemberUseCase, {
  GetTeamMemberUseCaseType,
} from "../../application/use-cases/team-member/get-team-members";
import getTeamMemberByUserIdUseCase, {
  GetTeamMemberByUserIdUseCaseType,
} from "../../application/use-cases/team-member/get-team-member-by-user-id";
import { DEFAULT_USERS_TEAM } from "../../entities/team-member";
import updateTeamMemberSkillUseCase, {
  type UpdateTeamMemberSkillUseCaseType,
} from "../../application/use-cases/team-member/update-team-member-skill";
import inviteOrSwitchTeamUseCase, {
  InviteOrSwitchTeamUseCaseType,
} from "../../application/use-cases/team-member/invite-or-switch-team";
import deleteTeamMemberUseCase, {
  DeleteTeamMemberUseCaseType,
} from "../../application/use-cases/team-member/delete-team-member";
import { httpError } from "../../adapters/express/httpError";
import getUserByEmailUseCase, {
  GetUserByEmailUseCaseType,
} from "../../application/use-cases/user/get-user-by-email";

type CreateTeamMemberControllerType = {
  body: { userId: string; teamId: string };
};
type GetTeamMemberByUserIdControllerType = {};
type InviteOrSwitchTeamController = {
  body: { email: string; consentId: string };
};
type GetTeamMembersByTeamIdController = { params: { teamId: string } };
type DeleteTeamMemberControllerType = { body: { id: string } };
type UpdateTeamMemberSkillControllerType = {
  params: { teamId: string };
  body: {
    memberId: string;
    canAccessStocks?: boolean;
    canAccessClients?: boolean;
    canAccessVisits?: boolean;
  };
};

const createTeamMemberController = (dependencies: {
  createTeamMemberUseCase: CreateTeamMemberUseCaseType;
  getTeamMembersUseCase: GetTeamMemberUseCaseType;
  getTeamMemberByUserIdUseCase: GetTeamMemberByUserIdUseCaseType;
  updateTeamMemberSkillUseCase: UpdateTeamMemberSkillUseCaseType;
  inviteOrSwitchTeamUseCase: InviteOrSwitchTeamUseCaseType;
  deleteTeamMemberUseCase: DeleteTeamMemberUseCaseType;
  getUserByEmailUseCase: GetUserByEmailUseCaseType;
}) => {
  const createTeamMemberController: ControllerFunction<
    CreateTeamMemberControllerType
  > = async (httpRequest) => {
    const { userId, teamId } = httpRequest.body;

    try {
      const newTeamMember = await dependencies.createTeamMemberUseCase.execute({
        userId,
        teamId,
      });

      return {
        statusCode: 201,
        body: newTeamMember,
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: { error },
      };
    }
  };
  const inviteOrSwitchTeamController: ControllerFunction<
    InviteOrSwitchTeamController
  > = async (httpRequest) => {
    const { email, consentId } = httpRequest.body;
    const userId = httpRequest.userId;

    const newTeamOwner = await dependencies.getUserByEmailUseCase.execute(
      email
    );

    const newTeam = await dependencies.getTeamMemberByUserIdUseCase.execute({
      userId: newTeamOwner.id,
    });

    if (!newTeam) {
      throw httpError("Nenalezen cílový tým.", 404);
    }

    try {
      const teamOwner = await dependencies.getTeamMemberByUserIdUseCase.execute(
        { userId }
      );

      if (newTeamOwner.id === userId) {
        throw httpError("Nemůžete se pozvat do vlastního týmu.", 404);
      }

      const newTeamMember =
        await dependencies.inviteOrSwitchTeamUseCase.execute({
          targetedUsersTeamEmail: email,
          targetedUserIdLast4: consentId,
          newTeamId: newTeam.teamId,
          userId,
        });

      return {
        statusCode: 201,
        body: newTeamMember,
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: { error },
      };
    }
  };

  const getTeamMembersByTeamIdController: ControllerFunction<
    GetTeamMembersByTeamIdController
  > = async (httpRequest) => {
    try {
      let teamId = httpRequest.params.teamId;

      const userId = httpRequest.userId;

      if (!teamId) {
        throw httpError("Tým ID je povinné.", 400);
      }

      if (teamId === DEFAULT_USERS_TEAM) {
        const teamMember =
          await dependencies.getTeamMemberByUserIdUseCase.execute({ userId });

        if (!teamMember?.teamId) {
          throw httpError("Žádný tým u tohoto uživatele.", 404);
        }

        teamId = teamMember.teamId;
      }

      const teamMembers = await dependencies.getTeamMembersUseCase.execute({
        teamId,
        userId,
      });

      return {
        statusCode: 200,
        body: teamMembers,
      };
    } catch (error) {
      console.error("getTeamMembersByTeamIdController", error);
      throw httpError("Chyba v hledání členů týmu.", 400);
    }
  };

  const getTeamMemberByUserIdController: ControllerFunction<
    GetTeamMemberByUserIdControllerType
  > = async (httpRequest) => {
    const userId = httpRequest.userId;

    if (!userId) {
      throw httpError("Uživatelské ID požadované.", 400);
    }

    try {
      const teamMember =
        await dependencies.getTeamMemberByUserIdUseCase.execute({
          userId,
        });

      if (!teamMember) {
        return {
          statusCode: 404,
          body: { error: "No team found for user" },
        };
      }

      return {
        statusCode: 200,
        body: teamMember,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: "Server error" },
      };
    }
  };

  const updateTeamMemberSkillController: ControllerFunction<
    UpdateTeamMemberSkillControllerType
  > = async (httpRequest) => {
    const teamId = httpRequest.params.teamId;
    const { memberId, ...updateData } = httpRequest.body;

    const memberData = {
      ...updateData,
      userId: httpRequest.body.memberId,
      teamId: teamId,
    };

    try {
      if (!teamId) {
        throw httpError("ID týmu je povinné", 400);
      }

      const updatedMember =
        await dependencies.updateTeamMemberSkillUseCase.execute(memberData);

      return {
        statusCode: 200,
        body: updatedMember,
      };
    } catch (error) {
      console.error("updateTeamMemberSkillController", error);
      throw httpError("Úprava práv člena týmu.", 500);
    }
  };
  const deleteTeamMemberController: ControllerFunction<
    DeleteTeamMemberControllerType
  > = async (httpRequest) => {
    const deletedUserId = httpRequest.body.id;

    try {
      if (!deletedUserId) {
        throw httpError("Nebylo předáno ID člena týmu.", 400);
      }

      const deletedTeamMember =
        await dependencies.deleteTeamMemberUseCase.execute(deletedUserId);

      return {
        statusCode: 200,
        body: deletedTeamMember,
      };
    } catch (error) {
      console.error("deleteTeamMemberController", error);
      throw httpError("Mazání člena týmu, neznámý error.", 500);
    }
  };

  return {
    createTeamMemberController,
    getTeamMembersByTeamIdController,
    getTeamMemberByUserIdController,
    updateTeamMemberSkillController,
    inviteOrSwitchTeamController,
    deleteTeamMemberController,
  };
};

const teamMemberController = createTeamMemberController({
  createTeamMemberUseCase,
  getTeamMembersUseCase: getTeamMemberUseCase,
  getTeamMemberByUserIdUseCase,
  updateTeamMemberSkillUseCase,
  inviteOrSwitchTeamUseCase,
  deleteTeamMemberUseCase,
  getUserByEmailUseCase,
});

export default teamMemberController;
