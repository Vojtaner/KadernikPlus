import { StockItem, StockItemCreateData } from "@/entities/stock-item";

export type StockItemRepositoryPort = {
  createStockItem(data: StockItemCreateData): Promise<StockItem>;
  getStockItemById(stockItemId: string): Promise<StockItem | null>;
  findStockItemByName(name: string): Promise<StockItem | null>;
  getStockItemsByStockId(stockId: string): Promise<StockItem[]>;
};
