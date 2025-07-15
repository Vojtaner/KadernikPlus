export type StockItem = {
  id: string;
  itemName: string;
  unit: Units;
  price: number;
  quantity: number;
  threshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type StockItemCreateData = Omit<
  StockItem,
  "createdAt" | "updatedAt" | "isActive" | "id"
> & { stockId: string };

export type Units = (typeof UnitsObject)[keyof typeof UnitsObject];

export const UnitsObject = {
  G: "g",
  MG: "mg",
  L: "l",
  ML: "ml",
  CM: "cm",
  MM: "mm",
  KS: "ks",
  BALENI: "balení",
};
