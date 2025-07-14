export type StockItem = {
  id: string;
  itemName: string;
  unit: Units;
  quantity: number;
  threshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type StockItemCreateData = Pick<
  StockItem,
  "unit" | "itemName" | "quantity" | "threshold"
>;

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
