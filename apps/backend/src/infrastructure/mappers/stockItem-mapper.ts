import { StockItem } from "@/entities/stock-item";

const mapToDomainStockItem = (prismaStockItem: {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  threshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): StockItem => {
  return {
    id: prismaStockItem.id,
    name: prismaStockItem.name,
    unit: prismaStockItem.unit,
    quantity: prismaStockItem.quantity,
    threshold: prismaStockItem.threshold,
    isActive: prismaStockItem.isActive,
    createdAt: prismaStockItem.createdAt,
    updatedAt: prismaStockItem.updatedAt,
  };
};

export default mapToDomainStockItem;
