import { ClientRepositoryPort } from "../../../application/ports/client-repository";
import clientRepositoryDb from "../../../infrastructure/data/prisma/prisma-client-repository";
import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";
import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";
import { ClientWithVisitsAndServices } from "../../../infrastructure/mappers/client-mapper";
import { httpError } from "../../../adapters/express/httpError";

const createSearchClientsUseCase = (dependencies: {
  clientRepositoryDb: ClientRepositoryPort;
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
}) => {
  return {
    execute: async (
      userId: string,
      idList: string[]
    ): Promise<ClientWithVisitsAndServices[]> => {
      if (!idList.length) {
        return [];
      }

      const teamMember =
        await dependencies.teamMemberRepositoryDb.findUniqueMember(userId);

      if (!teamMember) {
        throw httpError("Uživatel není v žádném týmu", 404);
      }

      const clients = await dependencies.clientRepositoryDb.search(
        idList,
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
