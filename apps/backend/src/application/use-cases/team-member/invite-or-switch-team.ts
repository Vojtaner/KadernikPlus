import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";
import { UserRepositoryPort } from "../../../application/ports/user-repository";
import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import stockRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-repository";
import { StockRepositoryPort } from "../../../application/ports/stock-repository";
import { httpError } from "../../../adapters/express/httpError";
import { StockItemRepositoryPort } from "@/application/ports/stock-item-repository";
import stockItemRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-item-repository";

const createInviteOrSwitchTeamUseCase = (dependencies: {
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
  userRepositoryDb: UserRepositoryPort;
  stockRepositoryDb: StockRepositoryPort;
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (data: {
      targetedUsersTeamEmail: string;
      targetedUserIdLast4: string;
      newTeamId: string;
      userId: string;
    }) => {
      const { targetedUsersTeamEmail, targetedUserIdLast4, newTeamId, userId } =
        data;

      const targetedUsersTeam = await dependencies.userRepositoryDb.findByEmail(
        targetedUsersTeamEmail
      );
      const usersCurrentMemberShip =
        await dependencies.teamMemberRepositoryDb.findUniqueMember(userId);

      const usersCurrentStock =
        await dependencies.stockRepositoryDb.getStocksByOwnerId(userId);

      if (!usersCurrentStock) {
        throw httpError("Chybí sklad k likvidaci.", 500);
      }

      if (!targetedUsersTeam) {
        throw httpError("Uživatel, ke kterému chcete do týmu nenalezen.", 404);
      }

      const last4 = targetedUsersTeam.id.slice(-4);

      if (last4 !== targetedUserIdLast4) {
        throw httpError("Souhlasné ID není správné.", 403);
      }

      if (
        usersCurrentMemberShip &&
        usersCurrentMemberShip.teamId !== newTeamId
      ) {
        await dependencies.teamMemberRepositoryDb.delete(
          usersCurrentMemberShip.id
        );
      }

      const stock = await dependencies.stockRepositoryDb.updateStock(
        newTeamId,
        userId
      );

      const newMember = await dependencies.teamMemberRepositoryDb.create({
        userId,
        teamId: newTeamId,
        canAccessStocks: true,
        canAccessClients: false,
        canAccessVisits: false,
      });

      await dependencies.stockItemRepositoryDb.deleteAll(usersCurrentStock?.id);

      return newMember;
    },
  };
};

export type InviteOrSwitchTeamUseCaseType = ReturnType<
  typeof createInviteOrSwitchTeamUseCase
>;

const inviteOrSwitchTeamUseCase = createInviteOrSwitchTeamUseCase({
  userRepositoryDb,
  teamMemberRepositoryDb,
  stockRepositoryDb,
  stockItemRepositoryDb,
});

export default inviteOrSwitchTeamUseCase;
