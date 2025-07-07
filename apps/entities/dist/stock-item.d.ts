/**
 * Represents a StockItem entity in the domain.
 */
export interface StockItem {
    id: string;
    name: string;
    unit: string;
    quantity: number;
    threshold: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Interface for creating a new StockItem.
 * 'isActive' can be optional here, with a default value set in Prisma.
 */
export interface StockItemCreateData {
    name: string;
    unit: string;
    quantity: number;
    threshold: number;
    isActive?: boolean;
}
