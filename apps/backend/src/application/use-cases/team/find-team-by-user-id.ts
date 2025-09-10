import teamRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-repository";
import { TeamRepositoryPort } from "../../ports/team-repository";

const createGetTeamByUserIdUseCase = (dependencies: {
  teamRepositoryDb: TeamRepositoryPort;
}) => {
  return {
    execute: async (userId: string) => {
      const team = await dependencies.teamRepositoryDb.findFirst(userId);

      return team;
    },
  };
};

export type GetTeamByUserIdUseCaseType = ReturnType<
  typeof createGetTeamByUserIdUseCase
>;

const getTeamByUserIdUseCase = createGetTeamByUserIdUseCase({
  teamRepositoryDb,
});

export default getTeamByUserIdUseCase;
