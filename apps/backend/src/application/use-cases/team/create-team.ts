import teamRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-repository";
import { TeamRepositoryPort } from "../../../application/ports/team-repository";

const createCreateTeamUseCase = (dependencies: {
  teamRepositoryDb: TeamRepositoryPort;
}) => {
  return {
    execute: async (teamData: { name: string }) => {
      const newTeam = await dependencies.teamRepositoryDb.create({
        name: `${teamData.name}`,
      });

      return newTeam;
    },
  };
};

export type CreateTeamUseCaseType = ReturnType<typeof createCreateTeamUseCase>;

const createTeamUseCase = createCreateTeamUseCase({
  teamRepositoryDb,
});

export default createTeamUseCase;
