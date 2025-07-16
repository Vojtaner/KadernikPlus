import { VisitCreateData } from "@/entities/visit";
import { VisitRepositoryPort } from "../../../application/ports/visit-repository";
import { PrismaClient, Service, Visit } from "@prisma/client";
import mapToDomainVisit, {
  CreatedVisit,
  VisitWithServices,
} from "../../mappers/visit-mapper";
import prisma from "./prisma";
import { WithUserId } from "@/entities/user";

export const createVisitRepositoryDb = (
  prismaVisitRepository: PrismaClient
): VisitRepositoryPort => ({
  add: async (
    visitData: WithUserId<VisitCreateData>
  ): Promise<CreatedVisit> => {
    const newVisit = await prismaVisitRepository.visit.create({
      data: {
        clientId: visitData.clientId,
        userId: visitData.userId,
        date: visitData.date,

        //paid price se musí odstranit asi s migrací?
        paidPrice: 1,
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

  findAll: async (clientId?: string): Promise<any> => {
    const whereClause = clientId ? { clientId } : {};
    const visits = await prismaVisitRepository.visit.findMany({
      where: whereClause,
    });
    return visits.map((visit) => mapToDomainVisit(visit as unknown as any));
  },

  //návštěva nevrací nově přidaná políčka deposit,depositStatus etc

  findById: async (visitId: string): Promise<VisitWithServices | null> => {
    console.log({ visitId });
    const visit = await prismaVisitRepository.visit.findUnique({
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
  }): Promise<Omit<Visit, "serviceIds"> & { services: Service[] }[]> => {
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

    const visits: VisitWithServices[] =
      await prismaVisitRepository.visit.findMany({
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

    return visits.map((visit) => mapToDomainVisit(visit)) as any;

    // return visits.map((visit) => mapToDomainVisit(visit));
  },

  delete: async (id: string): Promise<void> => {
    await prismaVisitRepository.$transaction([
      prismaVisitRepository.visitService.deleteMany({
        where: { visitId: id },
      }),
      prismaVisitRepository.photo.deleteMany({
        where: { visitId: id },
      }),
      prismaVisitRepository.procedure.deleteMany({
        where: { visitId: id },
      }),
      prismaVisitRepository.visit.delete({
        where: { id },
      }),
    ]);
  },
  update: async (visitData: any): Promise<any> => {
    const updatedVisit = await prismaVisitRepository.visit.update({
      where: { id: visitData.visitId },
      data: {
        note: visitData.note,
        paidPrice: visitData.paidPrice,
        date: visitData.date,
      },

      include: {
        visitServices: true,
      },
    });
    //se dodělá
    return mapToDomainVisit(updatedVisit as any);
  },
});

const visitRepositoryDb = createVisitRepositoryDb(prisma);

export default visitRepositoryDb;
