import { StockItemBuyData, StockItemCreateData } from "@/entities/stock-item";
import { StockItem } from "@prisma/client";

export type StockItemRepositoryPort = {
  createOrUpdateStockItem(
    data: StockItemCreateData | StockItemBuyData
  ): Promise<StockItem | undefined>;
  getStockItemById(
    stockItemId: string,
    userId: string
  ): Promise<StockItem | null>;
  deleteStockItem: (stockItemId: string, userId: string) => Promise<void>;
  findStockItemByName(name: string): Promise<StockItem | null>;
  getStockItemsByStockId(stockId: string, userId: string): Promise<StockItem[]>;
};
