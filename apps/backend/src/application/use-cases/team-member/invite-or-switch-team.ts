import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";
import { UserRepositoryPort } from "../../../application/ports/user-repository";
import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";

const createInviteOrSwitchTeamUseCase = (dependencies: {
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
  userRepositoryDb: UserRepositoryPort;
}) => {
  return {
    execute: async (data: {
      invitedEmail: string;
      invitedUserIdLast4: string;
      newTeamId: string;
    }) => {
      const { invitedEmail, invitedUserIdLast4, newTeamId } = data;

      const user = await dependencies.userRepositoryDb.findByEmail(
        invitedEmail
      );

      if (!user) {
        throw new Error("User not found with this email.");
      }

      const last4 = user.id.slice(-4);

      if (last4 !== invitedUserIdLast4) {
        throw new Error("User ID mismatch.");
      }

      const currentMembership =
        await dependencies.teamMemberRepositoryDb.findUniqueMember(user.id);

      if (currentMembership && currentMembership.teamId !== newTeamId) {
        await dependencies.teamMemberRepositoryDb.delete(currentMembership.id);
      }

      const newMember = await dependencies.teamMemberRepositoryDb.create({
        userId: user.id,
        teamId: newTeamId,
        canAccessStocks: false,
        canAccessClients: false,
        canAccessVisits: false,
      });

      console.log(newMember);

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
});

export default inviteOrSwitchTeamUseCase;
