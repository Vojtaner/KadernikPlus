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

      if (!existing) {
        throw new Error("Procedura nenalezena.");
      }

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
            toCreate.map(async (item) => {
              const stock = await tx.stockItem.findUnique({
                where: { id: item.stockItemId },
              });
              if (!stock) return;

              const oldQuantity = Number(stock.quantity);
              const oldPackageCount = Number(stock.packageCount ?? 1);
              const decrementedQuantity = Number(item.quantity);

              const newQuantity = oldQuantity - decrementedQuantity;
              const newPackageCount =
                oldPackageCount * (newQuantity / oldQuantity);

              await tx.stockItem.update({
                where: { id: item.stockItemId },
                data: {
                  quantity: { decrement: decrementedQuantity },
                  packageCount: new Prisma.Decimal(newPackageCount),
                },
              });
            })
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
          stockAllowances.map(async (item) => {
            const stockItem = await prisma.stockItem.findUnique({
              where: { id: item.stockItemId },
            });

            if (!stockItem) {
              return;
            }

            const oldQuantity = Number(stockItem.quantity);
            const oldPackageCount = Number(stockItem.packageCount ?? 1);
            const decrementedQuantity = Number(item.quantity);

            const newQuantity = oldQuantity - decrementedQuantity;

            const newPackageCount =
              oldPackageCount * (newQuantity / oldQuantity);

            await tx.stockItem.update({
              where: { id: item.stockItemId },
              data: {
                quantity: { decrement: decrementedQuantity },
                packageCount: new Prisma.Decimal(newPackageCount),
              },
            });
          })
        );
      }

      return created;
    });
  },

  delete: async (id: string) => {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.procedure.findUnique({
        where: { id },
        include: { stockAllowances: true },
      });

      if (!existing) {
        throw new Error("Procedura nenalezena.");
      }

      // Restore stock quantities and packageCount
      if (existing.stockAllowances.length > 0) {
        await Promise.all(
          existing.stockAllowances.map(async (item) => {
            const stock = await tx.stockItem.findUnique({
              where: { id: item.stockItemId },
            });
            if (!stock) return;

            const oldQuantity = Number(stock.quantity);
            const oldPackageCount = Number(stock.packageCount ?? 1);
            const incrementQuantity = Number(item.quantity);

            const newQuantity = oldQuantity + incrementQuantity;

            // Restore packageCount proportionally
            const newPackageCount =
              oldPackageCount * (newQuantity / oldQuantity);

            await tx.stockItem.update({
              where: { id: item.stockItemId },
              data: {
                quantity: { increment: incrementQuantity },
                packageCount: new Prisma.Decimal(newPackageCount),
              },
            });
          })
        );
      }

      await tx.stockAllowance.deleteMany({
        where: { procedureId: id },
      });

      return tx.procedure.delete({
        where: { id },
      });
    });

    return id;
  },
});

const procedureRepositoryDb = createProcedureRepositoryDb(prisma);
export default procedureRepositoryDb;
