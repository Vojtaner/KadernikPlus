import { PrismaClient, Stock } from ".prisma/client";
import { StockRepositoryPort } from "../../../application/ports/stock-repository";
import prisma from "./prisma";

const createStockRepositoryDb = (
  prismaStockRepository: PrismaClient
): StockRepositoryPort => {
  return {
    createStock: async (userId: string, teamId: string): Promise<Stock> => {
      const count = await prismaStockRepository.stock.count({
        where: { ownerId: userId },
      });

      const stock = await prismaStockRepository.stock.create({
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
      const stocks = await prismaStockRepository.stock.findMany({
        where: {
          ownerId: userId,
        },
      });

      return stocks;
    },
  };
};

const stockRepositoryDb = createStockRepositoryDb(prisma);

export default stockRepositoryDb;
