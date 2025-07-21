import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";

const createGetTeamMemberByUserIdUseCase = (dependencies: {
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
}) => {
  return {
    execute: async (data: { userId: string }) => {
      const teamMember =
        await dependencies.teamMemberRepositoryDb.findUniqueMember(data.userId);
      return teamMember;
    },
  };
};

export type GetTeamMemberByUserIdUseCaseType = ReturnType<
  typeof createGetTeamMemberByUserIdUseCase
>;

const getTeamMemberByUserIdUseCase = createGetTeamMemberByUserIdUseCase({
  teamMemberRepositoryDb,
});

export default getTeamMemberByUserIdUseCase;
