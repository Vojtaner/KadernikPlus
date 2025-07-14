import { StockItem, StockItemCreateData } from "@/entities/stock-item";

export type StockItemRepositoryPort = {
  createStockItem(data: StockItemCreateData): Promise<StockItem>;
  getStockItemById(id: string): Promise<StockItem | null>;
  findStockItemByName(name: string): Promise<StockItem | null>;
  getAllStockItems(): Promise<StockItem[]>;
};
