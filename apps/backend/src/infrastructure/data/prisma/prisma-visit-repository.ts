import { Visit, VisitCreateData } from "@/domain/entities/visit";
import { VisitRepository } from "@/application/ports/visit-repository";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma-based implementation of the VisitRepository interface.
 * This class acts as an adapter, translating generic VisitRepository operations
 * into specific Prisma Client operations for the 'Visit' model.
 */
export class PrismaVisitRepository implements VisitRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Inserts a new visit into the database using Prisma.
   * Maps Prisma's Visit model back to the domain Visit entity.
   */
  async add(visitData: VisitCreateData): Promise<Visit> {
    const newVisit = await this.prisma.visit.create({
      data: {
        clientId: visitData.clientId,
        userId: visitData.userId,
        date: visitData.date,
        note: visitData.note,
        paidPrice: visitData.paidPrice,
        // createdAt and updatedAt are @default(now()) and @updatedAt in Prisma schema
      },
    });
    // Map Prisma model to domain entity
    return this.toDomainVisit(newVisit);
  }

  /**
   * Finds a visit by its unique ID using Prisma.
   * Maps Prisma's Visit model back to the domain Visit entity.
   */
  async findById(id: string): Promise<Visit | null> {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
    });
    return visit ? this.toDomainVisit(visit) : null;
  }

  /**
   * Retrieves all visits from the database using Prisma, optionally filtered by client ID.
   * Maps Prisma's Visit models back to domain Visit entities.
   */
  async findAll(clientId?: string): Promise<Visit[]> {
    const whereClause = clientId ? { clientId } : {};
    const visits = await this.prisma.visit.findMany({
      where: whereClause,
      // You might want to include related data here, e.g., include: { client: true, user: true }
      // This would require updating the Visit domain entity to include these relationships.
    });
    return visits.map(this.toDomainVisit);
  }

  /**
   * Helper method to map a Prisma Visit object to a domain Visit entity.
   * Ensures the domain layer only deals with its own defined types.
   */
  private toDomainVisit(prismaVisit: {
    id: string;
    clientId: string;
    userId: string;
    date: Date;
    note: string | null;
    paidPrice: number;
    createdAt: Date;
    updatedAt: Date;
  }): Visit {
    return {
      id: prismaVisit.id,
      clientId: prismaVisit.clientId,
      userId: prismaVisit.userId,
      date: prismaVisit.date,
      note: prismaVisit.note,
      paidPrice: prismaVisit.paidPrice,
      // createdAt and updatedAt are typically not part of core domain entity for simple CRUD
    };
  }
}
