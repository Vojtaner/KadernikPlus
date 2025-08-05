import { ClientOrUpdateCreateData } from "@/entities/client";
import { ClientRepositoryPort } from "../../ports/client-repository";
import clientRepositoryDb from "../../../infrastructure/data/prisma/prisma-client-repository";
import { WithUserId } from "@/entities/user";
import { Client } from "@prisma/client";
import logRepositoryDb from "../../../infrastructure/data/prisma/prisma-log-repository";
import { LogRepositoryPort } from "../../../application/ports/log-repository";

class ClientAlreadyExistsError extends Error {
  constructor(phone: string) {
    super(`Client with phone number '${phone}' already exists.`);
    this.name = "ClientAlreadyExistsError";
  }
}

const createAddOrUpdateClientUseCase = (dependencies: {
  clientRepositoryDb: ClientRepositoryPort;
  logRepositoryDb: LogRepositoryPort;
}) => {
  return {
    execute: async (
      clientData: WithUserId<ClientOrUpdateCreateData>
    ): Promise<Client> => {
      let action = "create";
      let clientId: string | undefined = undefined;
      let message = "";

      const newOrUpdatedClient =
        await dependencies.clientRepositoryDb.addOrUpdate(clientData);

      if (clientData.id) {
        action = "update";
        clientId = clientData.id;
        message = `Upravený klient ${clientData.firstName} ${clientData.lastName}`;
      } else {
        clientId = newOrUpdatedClient.id;
        message = `Vytvořen klient ${newOrUpdatedClient.firstName} ${newOrUpdatedClient.lastName}`;
      }

      await dependencies.logRepositoryDb.log({
        userId: clientData.userId,
        action,
        entityType: "client",
        entityId: clientId,
        message,
        metadata: { input: clientData },
        teamId: newOrUpdatedClient.teamId,
      });

      return newOrUpdatedClient;
    },
  };
};

const addOrUpdateClientUseCase = createAddOrUpdateClientUseCase({
  clientRepositoryDb,
  logRepositoryDb,
});

export type CreateAddOrUpdateClientUseCaseType = ReturnType<
  typeof createAddOrUpdateClientUseCase
>;
export default addOrUpdateClientUseCase;
