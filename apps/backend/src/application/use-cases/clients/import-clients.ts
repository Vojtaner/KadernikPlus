import { ClientRepositoryPort } from "../../ports/client-repository";
import clientRepositoryDb from "../../../infrastructure/data/prisma/prisma-client-repository";
import { WithUserId } from "@/entities/user";

export type Contact = { firstName: string; lastName: string; phone: string };

const createImportClientsUseCase = (dependencies: {
  clientRepositoryDb: ClientRepositoryPort;
}) => {
  return {
    execute: async (
      clientData: WithUserId<{
        clientImport: Contact[];
      }>
    ): Promise<
      | { created: never[]; skipped: number }
      | { created: number; skipped: number }
    > => {
      const importedClients = await dependencies.clientRepositoryDb.importAll(
        clientData.userId,
        clientData.clientImport
      );

      return importedClients;
    },
  };
};

const importClientsUseCase = createImportClientsUseCase({
  clientRepositoryDb,
});

export type CreateImportClientsUseCaseType = ReturnType<
  typeof createImportClientsUseCase
>;
export default importClientsUseCase;
