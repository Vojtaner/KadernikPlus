import { StockAllowance } from "stock-item";

export type Procedure = {
  id: string;
  visitId: string;
  stepOrder: number;
  description: string | null;
  stockAllowanceId: string | null;
  createdAt: Date;
};

export type CreateProcedure = {
  id?: string;
  stepOrder: number;
  createdAt: Date;
  description?: string;
  visitId: string;
  stockAllowances: StockAllowance[];
};

export type PostNewProcedure = {
  description: string;
  visitId: string;
  stockAllowances: {
    stockItemId: string;
    quantity: number;
    userId: string;
  }[];
};
