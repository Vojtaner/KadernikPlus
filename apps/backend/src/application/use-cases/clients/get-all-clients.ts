import { Client } from "@/entities/client";
import { ClientRepositoryPort } from "../../ports/client-repository";
import clientRepositoryDb from "../../../infrastructure/data/prisma/prisma-client-repository";

const createGetAllClientsByUserIdUseCase = (dependencies: {
  clientRepositoryDb: ClientRepositoryPort;
}) => {
  return {
    execute: async (userId: string): Promise<Client[]> => {
      const clients = await dependencies.clientRepositoryDb.findAll(userId);
      return clients;
    },
  };
};

const getAllClientsByUserIdUseCase = createGetAllClientsByUserIdUseCase({
  clientRepositoryDb,
});

export type GetAllClientsByUserIdUseCaseType = ReturnType<
  typeof createGetAllClientsByUserIdUseCase
>;

export default getAllClientsByUserIdUseCase;
