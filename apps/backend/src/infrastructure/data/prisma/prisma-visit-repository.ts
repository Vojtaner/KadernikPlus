import { VisitCreateData, VisitDetailFormType } from "@/entities/visit";
import { VisitRepositoryPort } from "../../../application/ports/visit-repository";
import { Prisma, PrismaClient } from ".prisma/client";
import {
  CreatedVisit,
  VisitWithServices,
  VisitWithServicesWithProceduresWithStockAllowances,
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

    const serviceIds = [visitData.serviceIds];

    const newVisit = await prismaRepository.visit.create({
      data: {
        clientId: visitData.clientId,
        userId: visitData.userId,
        date: visitData.date,
        paidPrice: Number(visitData.paidPrice),
        teamId: userTeam.teamId,
        deposit: Number(visitData.deposit) ?? 0,
        visitServices: {
          create: serviceIds.map((serviceId) => ({
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

  findAll: async (
    clientId?: string
  ): Promise<VisitWithServicesWithProceduresWithStockAllowances[]> => {
    const whereClause = clientId ? { clientId } : {};
    const visits = await prismaRepository.visit.findMany({
      where: whereClause,
      include: {
        client: true,
        user: true,
        procedures: {
          include: { stockAllowances: { include: { stockItem: true } } },
        },
        visitServices: {
          include: {
            service: true,
          },
        },
      },
    });

    return visits;
  },

  findById: async (
    visitId: string
  ): Promise<VisitWithServicesWithProceduresWithStockAllowances | null> => {
    const visit = await prismaRepository.visit.findUnique({
      where: { id: visitId },
      include: {
        client: true,
        user: true,
        procedures: {
          include: { stockAllowances: { include: { stockItem: true } } },
        },
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
  }): Promise<VisitWithServicesWithProceduresWithStockAllowances[]> => {
    const { date, from, to, userId } = filter;

    const where = getWhereFilter(userId, date, from, to);

    const visits: VisitWithServicesWithProceduresWithStockAllowances[] =
      await prismaRepository.visit.findMany({
        where,
        include: {
          client: true,
          user: true,
          procedures: {
            include: { stockAllowances: { include: { stockItem: true } } },
          },
          visitServices: {
            include: {
              service: true,
            },
          },
        },
      });
    return visits;
  },

  delete: async (visitId: string): Promise<void> => {
    await prismaRepository.$transaction([
      prismaRepository.visitService.deleteMany({
        where: { visitId },
      }),
      prismaRepository.stockAllowance.deleteMany({
        where: {
          procedure: {
            visitId,
          },
        },
      }),
      prismaRepository.procedure.deleteMany({
        where: { visitId },
      }),
      prismaRepository.visit.delete({
        where: { id: visitId },
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
        note: visitData.note,

        depositStatus: { set: visitData.depositStatus },
        visitServices: {
          update: {
            where: {
              id: visitData.visitServiceId,
            },
            data: {
              serviceId: visitData.hairCutId,
            },
          },
        },
      },
    });
    return updatedVisit;
  },
});

const visitRepositoryDb = createVisitRepositoryDb(prisma);

export default visitRepositoryDb;

const getWhereFilter = (
  userId: string,
  date?: Date,
  from?: Date,
  to?: Date
) => {
  const where: Prisma.VisitWhereInput | undefined = {
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
  } else {
    return where;
  }
  return where;
};
