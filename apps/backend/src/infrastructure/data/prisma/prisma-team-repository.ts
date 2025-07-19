import { TeamRepositoryPort } from "@/application/ports/team-repository";
import { PrismaClient } from "@prisma/client";
import prisma from "./prisma";

const createTeamRepositoryDb = (prisma: PrismaClient): TeamRepositoryPort => ({
  create: async (teamData: { name: string }) => {
    const newTeam = await prisma.team.create({
      data: {
        name: teamData.name,
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
});

const teamRepositoryDb = createTeamRepositoryDb(prisma);

export default teamRepositoryDb;
