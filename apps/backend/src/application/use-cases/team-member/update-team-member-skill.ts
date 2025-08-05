import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";
import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";

const createUpdateTeamMemberSkillUseCase = (dependencies: {
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
}) => {
  return {
    execute: async (data: {
      userId: string;
      teamId: string;
      canAccessStocks?: boolean;
      canAccessClients?: boolean;
      canAccessVisits?: boolean;
    }) => {
      const updatedMember = await dependencies.teamMemberRepositoryDb.update(
        data
      );

      return updatedMember;
    },
  };
};

export type UpdateTeamMemberSkillUseCaseType = ReturnType<
  typeof createUpdateTeamMemberSkillUseCase
>;

const updateTeamMemberSkillUseCase = createUpdateTeamMemberSkillUseCase({
  teamMemberRepositoryDb,
});

export default updateTeamMemberSkillUseCase;
