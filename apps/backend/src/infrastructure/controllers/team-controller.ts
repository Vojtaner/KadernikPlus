import { ControllerFunction } from "@/adapters/express/make-express-callback";
import { GetTeamByIdUseCaseType } from "../../application/use-cases/team/get-team-by-id";
import getTeamByIdUseCase from "../../application/use-cases/team/get-team-by-id";

type GetTeamControllerType = { params: { teamId: string } };

const createTeamController = (dependencies: {
  getTeamByIdUseCase: GetTeamByIdUseCaseType;
}) => {
  const getTeamController: ControllerFunction<GetTeamControllerType> = async (
    httpRequest
  ) => {
    const teamId = httpRequest.params.teamId;

    const team = await dependencies.getTeamByIdUseCase.execute({
      teamId,
    });

    if (!team) {
      return {
        statusCode: 404,
        body: { error: "Team not found" },
      };
    }

    return {
      statusCode: 200,
      body: team,
    };
  };

  return {
    getTeamController,
  };
};

const teamController = createTeamController({
  getTeamByIdUseCase,
});

export default teamController;
