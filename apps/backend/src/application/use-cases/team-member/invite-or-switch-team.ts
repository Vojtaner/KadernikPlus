import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";
import { UserRepositoryPort } from "../../../application/ports/user-repository";
import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import stockRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-repository";
import { StockRepositoryPort } from "../../../application/ports/stock-repository";

const createInviteOrSwitchTeamUseCase = (dependencies: {
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
  userRepositoryDb: UserRepositoryPort;
  stockRepositoryDb: StockRepositoryPort;
}) => {
  return {
    execute: async (data: {
      invitedEmail: string;
      invitedUserIdLast4: string;
      newTeamId: string;
      userId: string;
    }) => {
      const { invitedEmail, invitedUserIdLast4, newTeamId } = data;
      //najít invited user za email
      //najit jeho teamId
      //najít najit dle toho teamId

      const invitedUser = await dependencies.userRepositoryDb.findByEmail(
        invitedEmail
      );

      if (!invitedUser) {
        throw new Error("User not found with this email.");
      }

      const last4 = invitedUser.id.slice(-4);

      if (last4 !== invitedUserIdLast4) {
        throw new Error("User ID mismatch.");
      }

      const currentMembership =
        await dependencies.teamMemberRepositoryDb.findUniqueMember(
          invitedUser.id
        );

      if (currentMembership && currentMembership.teamId !== newTeamId) {
        await dependencies.teamMemberRepositoryDb.delete(currentMembership.id);
      }

      const stock = await dependencies.stockRepositoryDb.updateStock(
        newTeamId,
        invitedUser.id
      );

      const newMember = await dependencies.teamMemberRepositoryDb.create({
        userId: invitedUser.id,
        teamId: newTeamId,
        canAccessStocks: false,
        canAccessClients: false,
        canAccessVisits: false,
      });

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
});

export default inviteOrSwitchTeamUseCase;
