import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";

const createGetTeamMemberUseCase = (dependencies: {
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
}) => {
  return {
    execute: async (data: { teamId: string }) => {
      const teamMembers = await dependencies.teamMemberRepositoryDb.findMany(
        data.teamId
      );

      return teamMembers;
    },
  };
};

export type GetTeamMemberUseCaseType = ReturnType<
  typeof createGetTeamMemberUseCase
>;

const getTeamMemberUseCase = createGetTeamMemberUseCase({
  teamMemberRepositoryDb,
});

export default getTeamMemberUseCase;
