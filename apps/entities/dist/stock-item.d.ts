export type StockItem = {
    id?: string;
    itemName: string;
    unit: Units;
    price: number;
    quantity: number;
    threshold: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    stockId: string;
};
export type StockItemDefaultValuesType = Pick<StockItem, "quantity" | "price" | "id" | "threshold" | "unit" | "itemName" | "stockId">;
export type StockItemCreateData = Omit<StockItem, "createdAt" | "updatedAt" | "isActive"> & {
    stockId: string;
};
export type StockItemBuyData = {
    id: string;
    price: number;
    quantity: number;
};
export type Units = (typeof UnitsObject)[keyof typeof UnitsObject];
export declare const UnitsObject: {
    G: string;
    MG: string;
    L: string;
    ML: string;
    CM: string;
    MM: string;
    KS: string;
    BALENI: string;
};
export type StockAllowance = {
    createdAt?: Date;
    id?: string;
    procedureId?: string;
    quantity: number;
    stockItem?: StockItem;
    stockItemId: string;
    userId?: string;
};
export type StockAllowanceFieldArrayType = {
    stockItemId: string;
    quantity: number;
    id: string;
};
