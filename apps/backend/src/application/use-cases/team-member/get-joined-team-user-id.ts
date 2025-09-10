import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";
import getTeamByUserIdUseCase, {
  GetTeamByUserIdUseCaseType,
} from "../team/find-team-by-user-id";

const createGetJoinedTeamsByUserIdUseCase = (dependencies: {
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
  getTeamByUserIdUseCase: GetTeamByUserIdUseCaseType;
}) => {
  return {
    execute: async (data: { userId: string }) => {
      const teamMemberShips = await dependencies.teamMemberRepositoryDb.findAll(
        data.userId
      );
      const joinedTeamMemberShips =
        await dependencies.getTeamByUserIdUseCase.execute(data.userId);

      const joinedTeams = teamMemberShips.filter(
        (teamMemberShip) => teamMemberShip.teamId !== joinedTeamMemberShips?.id
      );

      return joinedTeams;
    },
  };
};

export type GetJoinedTeamsByUserIdUseCaseType = ReturnType<
  typeof createGetJoinedTeamsByUserIdUseCase
>;

const getJoinedTeamsByUserIdUseCase = createGetJoinedTeamsByUserIdUseCase({
  teamMemberRepositoryDb,
  getTeamByUserIdUseCase,
});

export default getJoinedTeamsByUserIdUseCase;
