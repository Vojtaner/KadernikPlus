import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";

const createCreateTeamMemberUseCase = (dependencies: {
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
}) => {
  return {
    execute: async (data: { userId: string; teamId: string }) => {
      const newTeamMember = await dependencies.teamMemberRepositoryDb.create({
        userId: data.userId,
        teamId: data.teamId,
        canAccessStocks: true,
        canAccessClients: true,
        canAccessVisits: true,
      });

      return newTeamMember;
    },
  };
};

export type CreateTeamMemberUseCaseType = ReturnType<
  typeof createCreateTeamMemberUseCase
>;
const createTeamMemberUseCase = createCreateTeamMemberUseCase({
  teamMemberRepositoryDb,
});

export default createTeamMemberUseCase;
