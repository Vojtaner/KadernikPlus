import { StockItem, type Units } from "@/entities/stock-item";

const mapToDomainStockItem = (prismaStockItem: {
  id: string;
  itemName: string;
  unit: string;
  quantity: number;
  threshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): StockItem => {
  return {
    id: prismaStockItem.id,
    itemName: prismaStockItem.itemName,
    unit: prismaStockItem.unit,
    quantity: prismaStockItem.quantity,
    threshold: prismaStockItem.threshold,
    isActive: prismaStockItem.isActive,
    createdAt: prismaStockItem.createdAt,
    updatedAt: prismaStockItem.updatedAt,
  };
};

export default mapToDomainStockItem;
