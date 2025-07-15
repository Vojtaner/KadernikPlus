import { PrismaClient, Stock, StockItem } from ".prisma/client";
import { StockRepositoryPort } from "../../../application/ports/stock-repository";
import mapToDomainStock from "../../../infrastructure/mappers/stock-mapper";
import prisma from "./prisma";

const createStockRepositoryDb = (
  prismaStockRepository: PrismaClient
): StockRepositoryPort => {
  return {
    createStock: async (userId: string): Promise<Stock> => {
      const count = await prismaStockRepository.stock.count({
        where: { ownerId: userId },
      });
      const stock = await prismaStockRepository.stock.create({
        data: {
          ownerId: userId,
          stockName: `Stock ${count + 1}`,
        },
      });

      return mapToDomainStock(stock);
    },

    getStocks: async (userId: string): Promise<Stock[]> => {
      const stocks = await prismaStockRepository.stock.findMany({
        where: {
          ownerId: userId,
        },
      });

      return stocks.map((stock) => mapToDomainStock(stock));
    },
  };
};

const stockRepositoryDb = createStockRepositoryDb(prisma);
export default stockRepositoryDb;
