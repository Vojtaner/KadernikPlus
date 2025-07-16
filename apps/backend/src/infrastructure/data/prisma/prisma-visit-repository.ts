import { Visit, VisitCreateData } from "@/entities/visit";
import { VisitRepositoryPort } from "@/application/ports/visit-repository";
import { PrismaClient } from "@prisma/client";
import mapToDomainVisit from "../../mappers/visit-mapper";
import prisma from "./prisma";
import { WithUserId } from "@/entities/user";

export const createVisitRepositoryDb = (
  prismaVisitRepository: PrismaClient
): VisitRepositoryPort => ({
  add: async (visitData: WithUserId<VisitCreateData>): Promise<Visit> => {
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

    return mapToDomainVisit(newVisit);
  },

  findAll: async (clientId?: string): Promise<Visit[]> => {
    const whereClause = clientId ? { clientId } : {};
    const visits = await prismaVisitRepository.visit.findMany({
      where: whereClause,
    });
    return visits.map((visit) => mapToDomainVisit(visit as unknown as any));
  },

  findById: async (id: string): Promise<Visit | null> => {
    const visit = await prismaVisitRepository.visit.findUnique({
      where: { id },
    });
    return visit ? mapToDomainVisit(visit as unknown as any) : null;
  },
});

const visitRepositoryDb = createVisitRepositoryDb(prisma);

export default visitRepositoryDb;
