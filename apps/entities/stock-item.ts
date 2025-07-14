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

export interface StockItemCreateData {
  name: string;
  unit: string;
  quantity: number;
  threshold: number;
  isActive?: boolean;
}
