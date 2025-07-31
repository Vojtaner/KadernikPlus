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
  findByVisitId: async (visitId: string) => {
    return prisma.procedure.findMany({
      where: { visitId },
      orderBy: { stepOrder: "asc" },
      include: { stockAllowances: { include: { stockItem: true } } },
    });
  },

  addOrUpdate: async (data: ProcedureCreateData) => {
    const { id, userId, visitId, description, stockAllowances = [] } = data;

    const computeStepOrder = async () => {
      const lastStep = await prisma.procedure.findFirst({
        where: { visitId },
        orderBy: { stepOrder: "desc" },
      });
      return lastStep ? lastStep.stepOrder + 1 : 1;
    };

    if (id) {
      const existing = await prisma.procedure.findUnique({
        where: { id },
        include: { stockAllowances: true },
      });

      if (!existing) throw new Error("Procedura nenalezena.");

      const existingIds = new Set(existing.stockAllowances.map((s) => s.id));
      const incomingIds = new Set(
        stockAllowances.map((s) => s.stockAllowanceId).filter(Boolean)
      );

      const toCreate = stockAllowances.filter((s) => !s.stockAllowanceId);
      const toUpdate = stockAllowances.filter(
        (s) => s.stockAllowanceId && existingIds.has(s.stockAllowanceId)
      );
      const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));

      return prisma.$transaction(async (tx) => {
        const updated = await tx.procedure.update({
          where: { id },
          data: {
            description,
            visit: { connect: { id: visitId } },
            stockAllowances: {
              deleteMany: { id: { in: toDelete } },
              update: toUpdate.map((s) => ({
                where: { id: s.stockAllowanceId! },
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
          include: { stockAllowances: { include: { stockItem: true } } },
        });

        if (toCreate.length > 0) {
          await Promise.all(
            toCreate.map((item) =>
              tx.stockItem.update({
                where: { id: item.stockItemId },
                data: {
                  quantity: {
                    decrement: item.quantity,
                  },
                },
              })
            )
          );
        }

        return updated;
      });
    }

    const stepOrder = await computeStepOrder();

    return prisma.$transaction(async (tx) => {
      const created = await tx.procedure.create({
        data: {
          description,
          stepOrder,
          visit: { connect: { id: visitId } },
          stockAllowances: {
            create: stockAllowances.map((s) => ({
              stockItemId: s.stockItemId,
              quantity: s.quantity,
              userId,
            })),
          },
        },
        include: { stockAllowances: { include: { stockItem: true } } },
      });

      if (stockAllowances.length > 0) {
        await Promise.all(
          stockAllowances.map((item) =>
            tx.stockItem.update({
              where: { id: item.stockItemId },
              data: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            })
          )
        );
      }

      return created;
    });
  },
});

const procedureRepositoryDb = createProcedureRepositoryDb(prisma);
export default procedureRepositoryDb;
