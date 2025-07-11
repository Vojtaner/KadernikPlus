"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaStockItemRepository = void 0;
/**
 * Prisma implementation of the IStockItemRepository.
 * Connects to the database via Prisma Client to perform CRUD operations on StockItem.
 * Errors from Prisma operations will bubble up to the calling layer (e.g., Use Case or Controller).
 */
class PrismaStockItemRepository {
    constructor(prismaClient) {
        this.prisma = prismaClient;
    }
    /**
     * Adds a new stock item to the database.
     * @param data The data for the new stock item.
     * @returns The created StockItem entity.
     */
    async addStockItem(data) {
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
    async getStockItemById(id) {
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
    async findStockItemByName(name) {
        const stockItem = await this.prisma.stockItem.findUnique({
            where: { name },
        });
        return stockItem ? this.toDomainStockItem(stockItem) : null;
    }
    /**
     * Retrieves all stock items.
     * @returns A promise that resolves to an array of StockItem entities.
     */
    async getAllStockItems() {
        const stockItems = await this.prisma.stockItem.findMany();
        return stockItems.map(this.toDomainStockItem);
    }
    /**
     * Helper method to map a Prisma StockItem object to a domain StockItem entity.
     * This is important to ensure the domain layer only deals with its own defined types.
     */
    toDomainStockItem(prismaStockItem) {
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
exports.PrismaStockItemRepository = PrismaStockItemRepository;
