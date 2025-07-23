import { ClientCreateData } from "@/entities/client";
import { ClientRepositoryPort } from "../../ports/client-repository";
import clientRepositoryDb from "../../../infrastructure/data/prisma/prisma-client-repository";
import { WithUserId } from "@/entities/user";
import { Client } from "@prisma/client";

class ClientAlreadyExistsError extends Error {
  constructor(phone: string) {
    super(`Client with phone number '${phone}' already exists.`);
    this.name = "ClientAlreadyExistsError";
  }
}

const createAddOrUpdateClientUseCase = (dependencies: {
  clientRepositoryDb: ClientRepositoryPort;
}) => {
  return {
    execute: async (
      clientData: WithUserId<ClientCreateData>
    ): Promise<Client> => {
      if (clientData.phone) {
        const existingClient =
          await dependencies.clientRepositoryDb.findByPhone(clientData.phone);

        if (existingClient) {
          throw new ClientAlreadyExistsError(clientData.phone);
        }
      }

      const newOrUpdatedclient =
        await dependencies.clientRepositoryDb.addOrUpdate(clientData);

      return newOrUpdatedclient;
    },
  };
};

const addOrUpdateClientUseCase = createAddOrUpdateClientUseCase({
  clientRepositoryDb,
});

export type CreateAddOrUpdateClientUseCaseType = ReturnType<
  typeof createAddOrUpdateClientUseCase
>;
export default addOrUpdateClientUseCase;
