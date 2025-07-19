import teamRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-repository";
import { TeamRepositoryPort } from "../../ports/team-repository";

const createGetTeamByIdUseCase = (dependencies: {
  teamRepositoryDb: TeamRepositoryPort;
}) => {
  return {
    execute: async (data: { teamId: string }) => {
      const team = await dependencies.teamRepositoryDb.findById(data.teamId);

      return team;
    },
  };
};

export type GetTeamByIdUseCaseType = ReturnType<
  typeof createGetTeamByIdUseCase
>;

const getTeamByIdUseCase = createGetTeamByIdUseCase({
  teamRepositoryDb,
});

export default getTeamByIdUseCase;
