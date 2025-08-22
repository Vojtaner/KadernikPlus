import { ClientOrUpdateCreateData } from "../../../entities/client";
import { ClientRepositoryPort } from "../../../application/ports/client-repository";
import { Client, PrismaClient } from "@prisma/client";
import prisma from "./prisma";
import {
  ClientWithVisits,
  ClientWithVisitsAndServices,
} from "../../../infrastructure/mappers/client-mapper";
import { WithUserId } from "../../../entities/user";

const createClientRepositoryDb = (
  prismaRepository: PrismaClient
): ClientRepositoryPort => {
  return {
    findAll: async (userId: string): Promise<Client[]> => {
      const teamMember = await prismaRepository.teamMember.findFirst({
        where: {
          userId,
        },
      });

      const conditions: Record<string, number | string>[] = [{ userId }];

      if (teamMember?.canAccessClients && teamMember.teamId) {
        conditions.push({ teamId: teamMember.teamId });
      }

      const clients = await prismaRepository.client.findMany({
        where: { AND: conditions },
      });

      return clients;
    },
    search: async (
      teamId: string,
      query: string,
      userId: string
    ): Promise<ClientWithVisitsAndServices[]> => {
      const teamMember = await prismaRepository.teamMember.findFirst({
        where: {
          userId,
        },
      });

      const conditions: Record<string, number | string | { search: string }>[] =
        [
          {
            userId,
            firstName: {
              search: query,
            },
            lastName: {
              search: query,
            },
            phone: {
              search: query,
            },
          },
        ];

      if (teamMember?.canAccessClients && teamMember.teamId) {
        conditions.push({ teamId });
      }

      const clients = await prismaRepository.client.findMany({
        where: { AND: conditions },
        include: {
          visits: {
            include: { visitServices: { include: { service: true } } },
          },
        },
      });

      return clients;
    },
    addOrUpdate: async (
      clientData: WithUserId<ClientOrUpdateCreateData>
    ): Promise<Client> => {
      const { id: clientId } = clientData;

      if (clientId) {
        const existingClient = await prismaRepository.client.findFirst({
          where: {
            id: clientId,
          },
        });

        if (existingClient) {
          const { userId, id, teamId, ...updateFields } = clientData;

          const updatedClient = await prismaRepository.client.update({
            where: { id: clientId },
            data: updateFields,
          });

          return updatedClient;
        }
      }

      const userTeam = await prismaRepository.teamMember.findFirst({
        where: { userId: clientData.userId },
      });

      if (!userTeam) {
        throw new Error("User is not assigned to any team.");
      }

      if (!clientData.firstName || !clientData.lastName) {
        throw new Error("Zadejte jméno klienta.");
      }

      const newClient = await prismaRepository.client.create({
        data: {
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          phone: clientData.phone,
          note: clientData.note,
          userId: clientData.userId,
          deposit: clientData.deposit,
          teamId: userTeam.teamId,
        },
      });

      return newClient;
    },
    findById: async (
      id: string,
      userId: string
    ): Promise<ClientWithVisits | null> => {
      const teamMember = await prismaRepository.teamMember.findFirst({
        where: { userId },
      });

      const whereConditions: Record<string, string>[] = [{ id }];

      if (teamMember?.canAccessClients && teamMember.teamId) {
        whereConditions.push({ teamId: teamMember.teamId });
      }

      const client = await prismaRepository.client.findFirst({
        where: { AND: whereConditions },
        include: { visits: true },
      });

      if (!client) {
        throw new Error("Klient nebyl nalezen.");
      }

      const isOwnClient = !client.teamId;
      const isTeamClient =
        client.teamId === teamMember?.teamId && teamMember?.canAccessClients;

      if (isOwnClient || isTeamClient) {
        return client;
      }

      throw new Error(
        "Klient neexistuje, není ve vašem týmu nebo k němu nemáte oprávnění."
      );
    },

    findByPhone: async (phone: string): Promise<Client | null> => {
      const client = await prismaRepository.client.findUnique({
        where: { phone },
      });

      return client;
    },
  };
};

const clientRepositoryDb = createClientRepositoryDb(prisma);

export default clientRepositoryDb;
