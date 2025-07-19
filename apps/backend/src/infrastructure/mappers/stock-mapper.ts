import { Stock } from ".prisma/client";

const mapToDomainStock = (prismaStockItem: Stock): Omit<Stock, "teamId"> => {
  return {
    id: prismaStockItem.id,
    stockName: prismaStockItem.stockName,
    ownerId: prismaStockItem.ownerId,
    createdAt: prismaStockItem.createdAt,
  };
};

export default mapToDomainStock;
