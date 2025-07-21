import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";

const createCreateTeamMemberUseCase = (dependencies: {
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
}) => {
  return {
    execute: async (data: { userId: string; teamId: string }) => {
      //team zjisit na základe userID
      //ověřit že není již v jiném týmu
      //co se stane s bývalým týmem uživatele pozvaného do jiného týmu?
      // najít shodu mezi emailem a 4posledníma znaky userID
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
