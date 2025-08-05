import { ClientRepositoryPort } from "../../../application/ports/client-repository";
import clientRepositoryDb from "../../../infrastructure/data/prisma/prisma-client-repository";
import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";
import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import { ClientWithVisitsAndServices } from "@/infrastructure/mappers/client-mapper";

const createSearchClientsUseCase = (dependencies: {
  clientRepositoryDb: ClientRepositoryPort;
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
}) => {
  return {
    execute: async (
      userId: string,
      query: string
    ): Promise<ClientWithVisitsAndServices[]> => {
      if (!query) {
        return [];
      }
      const teamMember =
        await dependencies.teamMemberRepositoryDb.findUniqueMember(userId);

      if (!teamMember) {
        throw Error("User has no team assigned.");
      }

      const clients = await dependencies.clientRepositoryDb.search(
        teamMember.teamId,
        query,
        userId
      );

      return clients;
    },
  };
};

const searchClientsUseCase = createSearchClientsUseCase({
  clientRepositoryDb,
  teamMemberRepositoryDb,
});

export type SearchClientsUseCaseType = ReturnType<
  typeof createSearchClientsUseCase
>;

export default searchClientsUseCase;
