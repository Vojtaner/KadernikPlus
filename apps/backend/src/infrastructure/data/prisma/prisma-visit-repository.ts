import { VisitCreateData, VisitDetailFormType } from "@/entities/visit";
import { VisitRepositoryPort } from "../../../application/ports/visit-repository";
import { PrismaClient, Service, Visit } from "@prisma/client";
import mapToDomainVisit, {
  CreatedVisit,
  VisitWithServices,
} from "../../mappers/visit-mapper";
import prisma from "./prisma";
import { WithUserId } from "@/entities/user";
import { HasId } from "@/domain/entity";

export const createVisitRepositoryDb = (
  prismaRepository: PrismaClient
): VisitRepositoryPort => ({
  add: async (
    visitData: WithUserId<VisitCreateData>
  ): Promise<CreatedVisit> => {
    const userTeam = await prismaRepository.teamMember.findFirst({
      where: { userId: visitData.userId },
    });

    if (!userTeam) {
      throw new Error("User is not assigned to any team.");
    }

    const newVisit = await prismaRepository.visit.create({
      data: {
        clientId: visitData.clientId,
        userId: visitData.userId,
        date: visitData.date,

        //paid price se musí odstranit asi s migrací?
        paidPrice: 1,
        teamId: userTeam.teamId, //teamId se musí přidat do VisitCreateData",
        visitServices: {
          create: visitData.serviceIds.map((serviceId) => ({
            service: { connect: { id: serviceId } },
          })),
        },
      },
      include: {
        visitServices: true,
      },
    });

    return newVisit;
  },
  updateStatus: async (visitId: string, checked: boolean) => {
    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        visitStatus: checked,
      },
    });

    return updatedVisit;
  },

  findAll: async (clientId?: string): Promise<VisitWithServices[]> => {
    const whereClause = clientId ? { clientId } : {};
    const visits = await prismaRepository.visit.findMany({
      where: whereClause,
      include: {
        client: true,
        visitServices: {
          include: {
            service: true,
          },
        },
      },
    });

    return visits;
  },

  //návštěva nevrací nově přidaná políčka deposit,depositStatus etc

  findById: async (visitId: string): Promise<VisitWithServices | null> => {
    const visit = await prismaRepository.visit.findUnique({
      where: { id: visitId },
      include: {
        client: true,
        visitServices: {
          include: {
            service: true,
          },
        },
      },
    });

    return visit ? visit : null;
  },

  findByDate: async (filter: {
    date?: Date;
    from?: Date;
    to?: Date;
    userId: string;
  }): Promise<VisitWithServices[]> => {
    const { date, from, to, userId } = filter;

    const where: any = {
      userId,
    };

    if (date) {
      const start = new Date(date);

      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      where.date = {
        gte: start,
        lte: end,
      };
    } else if (from && to) {
      where.date = {
        gte: new Date(from),
        lte: new Date(to),
      };
    } else if (from) {
      where.date = {
        gte: new Date(from),
      };
    } else if (to) {
      where.date = {
        lte: new Date(to),
      };
    }

    const visits: VisitWithServices[] = await prismaRepository.visit.findMany({
      where,
      include: {
        client: true,
        visitServices: {
          include: {
            service: true,
          },
        },
      },
    });

    return visits;
  },

  delete: async (id: string): Promise<void> => {
    await prismaRepository.$transaction([
      prismaRepository.visitService.deleteMany({
        where: { visitId: id },
      }),
      prismaRepository.photo.deleteMany({
        where: { visitId: id },
      }),
      prismaRepository.procedure.deleteMany({
        where: { visitId: id },
      }),
      prismaRepository.visit.delete({
        where: { id },
      }),
    ]);
  },
  update: async (visitData: VisitDetailFormType & HasId): Promise<any> => {
    const updatedVisit = await prismaRepository.visit.update({
      where: { id: visitData.id },
      data: {
        paidPrice: visitData.paidPrice,
        date: visitData.date,
        deposit: Number(visitData.deposit),
        depositStatus: { set: visitData.depositStatus as any }, //po restartu dockeru se srovná
      },

      include: {
        visitServices: true,
      },
    });
    return updatedVisit;
  },
});

const visitRepositoryDb = createVisitRepositoryDb(prisma);

export default visitRepositoryDb;
