import teamRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-repository";
import { TeamRepositoryPort } from "../../../application/ports/team-repository";

const createCreateTeamUseCase = (dependencies: {
  teamRepositoryDb: TeamRepositoryPort;
}) => {
  return {
    execute: async (teamData: { name: string; userId: string }) => {
      const newTeam = await dependencies.teamRepositoryDb.create({
        name: `${teamData.name}`,
        userId: teamData.userId,
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
