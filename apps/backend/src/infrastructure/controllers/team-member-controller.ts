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
import { DEFAULT_USERS_TEAM } from "../../../../entities/team-member";
import updateTeamMemberSkillUseCase, {
  type UpdateTeamMemberSkillUseCaseType,
} from "../../application/use-cases/team-member/update-team-member-skill";
import inviteOrSwitchTeamUseCase, {
  InviteOrSwitchTeamUseCaseType,
} from "../../application/use-cases/team-member/invite-or-switch-team";
import deleteTeamMemberUseCase, {
  DeleteTeamMemberUseCaseType,
} from "../../application/use-cases/team-member/delete-team-member";

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

    try {
      const teamOwner = await dependencies.getTeamMemberByUserIdUseCase.execute(
        { userId }
      );

      if (!teamOwner) {
        throw Error("You do not have any team. You are not allowed to invite.");
      }

      const newTeamMember =
        await dependencies.inviteOrSwitchTeamUseCase.execute({
          invitedEmail: email,
          invitedUserIdLast4: consentId,
          newTeamId: teamOwner?.teamId,
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
        return {
          statusCode: 400,
          body: { error: "Team ID is required" },
        };
      }

      if (teamId === DEFAULT_USERS_TEAM) {
        const teamMember =
          await dependencies.getTeamMemberByUserIdUseCase.execute({ userId });

        if (!teamMember?.teamId) {
          return {
            statusCode: 404,
            body: { error: "No team associated with this user" },
          };
        }

        teamId = teamMember.teamId;
      }

      const teamMembers = await dependencies.getTeamMembersUseCase.execute({
        teamId,
      });

      return {
        statusCode: 200,
        body: teamMembers,
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: { error },
      };
    }
  };

  const getTeamMemberByUserIdController: ControllerFunction<
    GetTeamMemberByUserIdControllerType
  > = async (httpRequest) => {
    const userId = httpRequest.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: { error: "User ID is required" },
      };
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

    const memberData = {
      ...httpRequest.body,
      userId: httpRequest.body.memberId,
      teamId: teamId,
    };

    try {
      if (!teamId) {
        return {
          statusCode: 400,
          body: { error: "Member ID is required" },
        };
      }

      const updatedMember =
        await dependencies.updateTeamMemberSkillUseCase.execute(memberData);

      return {
        statusCode: 200,
        body: updatedMember,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: "Server error" },
      };
    }
  };
  const deleteTeamMemberController: ControllerFunction<
    DeleteTeamMemberControllerType
  > = async (httpRequest) => {
    const id = httpRequest.body.id;

    try {
      if (!id) {
        return {
          statusCode: 400,
          body: { error: "Team member does not exists." },
        };
      }
      const deletedTeamMember =
        await dependencies.deleteTeamMemberUseCase.execute(id);

      return {
        statusCode: 200,
        body: deletedTeamMember,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: "Server error" },
      };
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
});

export default teamMemberController;
