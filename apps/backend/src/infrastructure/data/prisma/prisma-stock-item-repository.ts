import { PrismaClient } from "@prisma/client";
import { StockItem, StockItemCreateData } from "@/entities/stock-item";
import { IStockItemRepository } from "@/application/ports/stock-item-repository";

/**
 * Prisma implementation of the IStockItemRepository.
 * Connects to the database via Prisma Client to perform CRUD operations on StockItem.
 * Errors from Prisma operations will bubble up to the calling layer (e.g., Use Case or Controller).
 */
export class PrismaStockItemRepository implements IStockItemRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Adds a new stock item to the database.
   * @param data The data for the new stock item.
   * @returns The created StockItem entity.
   */
  async addStockItem(data: StockItemCreateData): Promise<StockItem> {
    const stockItem = await this.prisma.stockItem.create({
      data: {
        name: data.name,
        unit: data.unit,
        quantity: data.quantity,
        threshold: data.threshold,
        isActive: data.isActive ?? true,
      },
    });
    return this.toDomainStockItem(stockItem);
  }

  /**
   * Retrieves a stock item by its unique ID.
   * @param id The ID of the stock item.
   * @returns The StockItem entity if found, otherwise null.
   */
  async getStockItemById(id: string): Promise<StockItem | null> {
    const stockItem = await this.prisma.stockItem.findUnique({
      where: { id },
    });
    return stockItem ? this.toDomainStockItem(stockItem) : null;
  }

  /**
   * Finds a stock item by its unique name.
   * @param name The name of the stock item.
   * @returns The StockItem entity if found, otherwise null.
   */
  async findStockItemByName(name: string): Promise<StockItem | null> {
    const stockItem = await this.prisma.stockItem.findUnique({
      where: { name },
    });
    return stockItem ? this.toDomainStockItem(stockItem) : null;
  }

  /**
   * Retrieves all stock items.
   * @returns A promise that resolves to an array of StockItem entities.
   */
  async getAllStockItems(): Promise<StockItem[]> {
    const stockItems = await this.prisma.stockItem.findMany();
    return stockItems.map(this.toDomainStockItem);
  }

  /**
   * Helper method to map a Prisma StockItem object to a domain StockItem entity.
   * This is important to ensure the domain layer only deals with its own defined types.
   */
  private toDomainStockItem(prismaStockItem: {
    id: string;
    name: string;
    unit: string;
    quantity: number;
    threshold: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Add any other fields from your Prisma StockItem model here
  }): StockItem {
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
  }
}
