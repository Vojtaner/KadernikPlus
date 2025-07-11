import { PrismaClient } from "@prisma/client";
import { StockItem, StockItemCreateData } from "@/entities/stock-item";
import { StockItemRepositoryPort } from "@/application/ports/stock-item-repository";
import mapToDomainStockItem from "../../../infrastructure/mappers/stockItem-mapper";
import prisma from "./prisma";

const createStockItemRepositoryDb = (
  prismaStockRepository: PrismaClient
): StockItemRepositoryPort => {
  return {
    addStockItem: async (data: StockItemCreateData): Promise<StockItem> => {
      const stockItem = await prismaStockRepository.stockItem.create({
        data: {
          name: data.name,
          unit: data.unit,
          quantity: data.quantity,
          threshold: data.threshold,
          isActive: data.isActive ?? true,
        },
      });
      return mapToDomainStockItem(stockItem);
    },

    getStockItemById: async (id: string): Promise<StockItem | null> => {
      const stockItem = await prismaStockRepository.stockItem.findUnique({
        where: { id },
      });
      return stockItem ? mapToDomainStockItem(stockItem) : null;
    },

    findStockItemByName: async (name: string): Promise<StockItem | null> => {
      const stockItem = await prismaStockRepository.stockItem.findUnique({
        where: { name },
      });
      return stockItem ? mapToDomainStockItem(stockItem) : null;
    },

    getAllStockItems: async (): Promise<StockItem[]> => {
      const stockItems = await prismaStockRepository.stockItem.findMany();
      return stockItems.map(mapToDomainStockItem);
    },
  };
};

const stockItemRepositoryDb = createStockItemRepositoryDb(prisma);

export default stockItemRepositoryDb;
