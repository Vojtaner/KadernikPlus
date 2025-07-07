/**
 * Represents a StockItem entity in the domain.
 */
export interface StockItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  threshold: number;
  isActive: boolean; // Changed from is_active to isActive
  createdAt: Date;
  updatedAt: Date;
  // Assuming StockAllowance is another entity you'll define
  // stockAllowances: StockAllowance[]; // Add this if you need to represent the relation in the entity
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
  isActive?: boolean; // Changed from is_active to isActive
}