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

type CreateTeamMemberControllerType = {
  body: { userId: string; teamId: string };
};
type GetTeamMemberByUserIdControllerType = {};
type GetTeamMembersByTeamIdController = { params: { teamId: string } };

const createTeamMemberController = (dependencies: {
  createTeamMemberUseCase: CreateTeamMemberUseCaseType;
  getTeamMembersUseCase: GetTeamMemberUseCaseType;
  getTeamMemberByUserIdUseCase: GetTeamMemberByUserIdUseCaseType;
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

  return {
    createTeamMemberController,
    getTeamMembersByTeamIdController,
    getTeamMemberByUserIdController,
  };
};

const teamMemberController = createTeamMemberController({
  createTeamMemberUseCase,
  getTeamMembersUseCase: getTeamMemberUseCase,
  getTeamMemberByUserIdUseCase,
});

export default teamMemberController;
