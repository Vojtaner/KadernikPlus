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
export type StockItemCreateData = Omit<StockItem, "createdAt" | "updatedAt" | "isActive" | "id"> & {
    stockId: string;
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
