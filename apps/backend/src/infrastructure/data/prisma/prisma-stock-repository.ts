import { PrismaClient, Stock } from ".prisma/client";
import { StockRepositoryPort } from "../../../application/ports/stock-repository";
import prisma from "./prisma";

const createStockRepositoryDb = (prisma: PrismaClient): StockRepositoryPort => {
  return {
    createStock: async (userId: string, teamId: string): Promise<Stock> => {
      const count = await prisma.stock.count({
        where: { ownerId: userId },
      });

      const stock = await prisma.stock.create({
        data: {
          ownerId: userId,
          stockName: `Sklad ${count + 1}`,
          teamId,
        },
      });

      return stock;
    },
    updateStock: async (
      teamId: string,
      invitedUserId: string
    ): Promise<Stock> => {
      const stockToUpdate = await prisma.stock.findFirst({
        where: { ownerId: invitedUserId },
      });

      if (stockToUpdate) {
        const updatedStock = await prisma.stock.update({
          where: { id: stockToUpdate.id },
          data: { teamId },
        });

        return updatedStock;
      } else {
        throw new Error("Sklad zvaného uživatele nenalezen. Nemožné přidat.");
      }
    },

    getStocks: async (userId: string): Promise<Stock[]> => {
      const teamIds = await prisma.teamMember.findMany({
        where: { userId },
        select: { teamId: true },
      });

      const stocks = await prisma.stock.findMany({
        where: {
          OR: [
            {
              ownerId: userId,
            },
            { teamId: { in: teamIds.map((t) => t.teamId) } },
          ],
        },
      });

      return stocks;
    },
    getStocksByOwnerId: async (userId: string): Promise<Stock | null> => {
      const stock = await prisma.stock.findFirst({
        where: { ownerId: userId },
      });

      return stock;
    },
  };
};

const stockRepositoryDb = createStockRepositoryDb(prisma);

export default stockRepositoryDb;
