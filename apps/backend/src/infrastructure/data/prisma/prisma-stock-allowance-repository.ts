import { PrismaClient } from ".prisma/client";
import { StockAllowanceRepositoryPort } from "../../../application/ports/stock-allowance-repository";
import prisma from "./prisma";
import { StockAllowanceWithProcedureAndItem } from "@/entities/stock-allowance";

const createStockAllowanceRepositoryDb = (
  prisma: PrismaClient
): StockAllowanceRepositoryPort => {
  return {
    getAllByDatesAndTeamId: async (
      teamId: string,
      fromDate: Date,
      toDate: Date
    ): Promise<StockAllowanceWithProcedureAndItem[]> => {
      const stockAllowances = await prisma.stockAllowance.findMany({
        where: {
          teamId,
          createdAt: { gte: fromDate, lte: toDate },
        },
        include: {
          procedure: {
            select: { visitId: true, visit: { select: { clientId: true } } },
          },
          stockItem: {
            select: { itemName: true, avgUnitPrice: true, unit: true },
          },
          user: { select: { name: true } },
        },
      });

      console.log({ stockAllowances });
      return stockAllowances;
    },
  };
};

const stockAllowanceRepositoryDb = createStockAllowanceRepositoryDb(prisma);

export default stockAllowanceRepositoryDb;
