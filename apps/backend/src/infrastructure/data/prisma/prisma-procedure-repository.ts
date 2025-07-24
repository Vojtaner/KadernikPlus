import { Prisma, PrismaClient, Procedure } from ".prisma/client";
import {
  ProcedureCreateData,
  ProcedureRepositoryPort,
} from "../../../application/ports/procedure-repository";
import prisma from "./prisma";

export const fullProcedureInclude = Prisma.validator<Prisma.ProcedureInclude>()(
  {
    stockAllowances: {
      include: {
        stockItem: true,
      },
    },
  }
);

export type FullProcedure = Prisma.ProcedureGetPayload<{
  include: typeof fullProcedureInclude;
}>;

const createProcedureRepositoryDb = (
  prisma: PrismaClient
): ProcedureRepositoryPort => ({
  findByVisitId: async (visitId: string): Promise<Procedure[]> => {
    return prisma.procedure.findMany({
      where: { visitId },
      orderBy: { stepOrder: "asc" },
      include: { stockAllowances: { include: { stockItem: true } } },
    });
  },
  addOrUpdate: async (data: ProcedureCreateData) => {
    const { userId } = data;
    console.log({ procData: data.stockAllowances });

    if (data.id) {
      const existing = await prisma.procedure.findUnique({
        where: { id: data.id },
        include: {
          stockAllowances: true,
        },
      });

      if (existing) {
        const incoming = data.stockAllowances ?? [];

        const incomingIds = incoming
          .filter((s) => s.stockAllowanceId)
          .map((s) => s.stockAllowanceId);
        const existingIds = existing?.stockAllowances.map((s) => s.id) ?? [];

        const toCreate = incoming.filter((s) => !s.stockAllowanceId);
        const toUpdate = incoming.filter(
          (s) => s.stockAllowanceId && existingIds.includes(s.stockAllowanceId)
        );
        const toDelete = existingIds.filter((id) => !incomingIds.includes(id));

        return prisma.procedure.update({
          where: { id: data.id },
          data: {
            description: data.description,
            visit: {
              connect: { id: data.visitId },
            },
            stockAllowances: {
              deleteMany: {
                id: { in: toDelete },
              },
              update: toUpdate.map((s) => ({
                where: { id: s.stockAllowanceId },
                data: {
                  stockItemId: s.stockItemId,
                  quantity: s.quantity,
                },
              })),
              create: toCreate.map((s) => ({
                stockItemId: s.stockItemId,
                quantity: s.quantity,
                userId,
              })),
            },
          },
          include: {
            stockAllowances: {
              include: {
                stockItem: true,
              },
            },
          },
        });
      }
    }

    const lastStep = await prisma.procedure.findFirst({
      where: { visitId: data.visitId },
      orderBy: { stepOrder: "desc" },
    });

    const newStepOrder = lastStep ? lastStep.stepOrder + 1 : 1;

    const newProcedure = await prisma.procedure.create({
      data: {
        description: data.description,
        stepOrder: newStepOrder,
        visit: {
          connect: { id: data.visitId },
        },
        stockAllowances: {
          create: data.stockAllowances
            ? data.stockAllowances.map((s) => ({
                stockItemId: s.stockItemId,
                quantity: s.quantity,
                userId,
              }))
            : [],
        },
      },
      include: {
        stockAllowances: {
          include: {
            stockItem: true,
          },
        },
      },
    });

    return newProcedure;
  },
});

const procedureRepositoryDb = createProcedureRepositoryDb(prisma);
export default procedureRepositoryDb;
