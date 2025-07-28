import { TeamMemberRepositoryPort } from "../../../application/ports/team-member-repository";
import { PrismaClient, TeamMember } from ".prisma/client";
import prisma from "./prisma";
import { DEFAULT_USERS_TEAM } from "../../../../../entities/team-member";

const createTeamMemberRepositoryDb = (
  prisma: PrismaClient
): TeamMemberRepositoryPort => ({
  create: async (memberData: {
    userId: string;
    teamId: string;
    canAccessStocks: boolean;
    canAccessClients: boolean;
    canAccessVisits: boolean;
  }) => {
    const newMember = await prisma.teamMember.create({
      data: {
        userId: memberData.userId,
        teamId: memberData.teamId,
        canAccessStocks: memberData.canAccessStocks,
        canAccessClients: memberData.canAccessClients,
        canAccessVisits: memberData.canAccessVisits,
      },
    });
    return newMember;
  },
  delete: async (teamMemberRowId: string) => {
    await prisma.teamMember.delete({
      where: {
        id: teamMemberRowId,
      },
    });
  },

  findMany: async (teamId: string, userId: string) => {
    if (DEFAULT_USERS_TEAM === teamId) {
      const members = await prisma.teamMember.findMany({
        where: {
          teamId,
          NOT: {
            userId: userId,
          },
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      return members;
    }

    const members = await prisma.teamMember.findMany({
      where: {
        teamId,
        NOT: {
          userId: userId,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return members;
  },
  findUniqueMember: async (userId: string): Promise<TeamMember | null> => {
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        userId,
      },
    });
    return teamMember;
  },
  update: async (data) => {
    const teamMember = await prisma.teamMember.upsert({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId: data.userId,
        },
      },
      update: {
        canAccessClients: data.canAccessClients,
        canAccessStocks: data.canAccessStocks,
        canAccessVisits: data.canAccessVisits,
      },
      create: {
        teamId: data.teamId,
        userId: data.userId,
        canAccessClients: data.canAccessClients,
        canAccessStocks: data.canAccessStocks,
        canAccessVisits: data.canAccessVisits,
      },
    });

    return teamMember;
  },
});

const teamMemberRepositoryDb = createTeamMemberRepositoryDb(prisma);

export default teamMemberRepositoryDb;
