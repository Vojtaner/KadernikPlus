import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";

const createDeleteTeamMemberUseCase = (dependencies: {
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
}) => {
  return {
    execute: async (id: string) => {
      const deletedMember = await dependencies.teamMemberRepositoryDb.delete(
        id
      );

      return deletedMember;
    },
  };
};

export type DeleteTeamMemberUseCaseType = ReturnType<
  typeof createDeleteTeamMemberUseCase
>;
const deleteTeamMemberUseCase = createDeleteTeamMemberUseCase({
  teamMemberRepositoryDb,
});

export default deleteTeamMemberUseCase;
