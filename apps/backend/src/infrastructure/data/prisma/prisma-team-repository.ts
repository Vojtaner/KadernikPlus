import { TeamRepositoryPort } from "@/application/ports/team-repository";
import { PrismaClient } from "@prisma/client";
import prisma from "./prisma";

const createTeamRepositoryDb = (prisma: PrismaClient): TeamRepositoryPort => ({
  create: async (teamData: { name: string; userId: string }) => {
    const newTeam = await prisma.team.create({
      data: {
        name: teamData.name,
        userId: teamData.userId,
      },
    });

    return newTeam;
  },

  findById: async (teamId: string) => {
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });
    return team;
  },
  findFirst: async (userId: string) => {
    const team = await prisma.team.findFirst({
      where: {
        userId: userId,
      },
    });
    return team;
  },
});

const teamRepositoryDb = createTeamRepositoryDb(prisma);

export default teamRepositoryDb;
