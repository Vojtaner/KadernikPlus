import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";
import getTeamByUserIdUseCase, {
  GetTeamByUserIdUseCaseType,
} from "../team/find-team-by-user-id";
import { httpError } from "../../../adapters/express/httpError";
import { StockRepositoryPort } from "@/application/ports/stock-repository";
import stockRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-repository";

const createDeleteTeamMemberUseCase = (dependencies: {
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
  getTeamByUserIdUseCase: GetTeamByUserIdUseCaseType;
  stockRepositoryDb: StockRepositoryPort;
}) => {
  return {
    execute: async (deletedUserId: string) => {
      const userTeam = await dependencies.getTeamByUserIdUseCase.execute(
        deletedUserId
      );

      if (userTeam?.id) {
        const teamMember = await dependencies.teamMemberRepositoryDb.update({
          teamId: userTeam.id,
          canAccessClients: true,
          canAccessStocks: true,
          canAccessVisits: true,
          userId: deletedUserId,
        });
        const stock = await dependencies.stockRepositoryDb.updateStock(
          userTeam.id,
          deletedUserId
        );

        return teamMember;
      }
      throw httpError("Uživatel nemá žádný tým.", 404);
    },
  };
};

export type DeleteTeamMemberUseCaseType = ReturnType<
  typeof createDeleteTeamMemberUseCase
>;
const deleteTeamMemberUseCase = createDeleteTeamMemberUseCase({
  teamMemberRepositoryDb,
  getTeamByUserIdUseCase,
  stockRepositoryDb,
});

export default deleteTeamMemberUseCase;
