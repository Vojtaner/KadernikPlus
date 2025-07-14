export type StockItem = {
    id: string;
    itemName: string;
    unit: string;
    quantity: number;
    threshold: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};
export type StockItemCreateData = Pick<StockItem, "unit" | "itemName" | "quantity" | "threshold">;
export declare const Units: {
    readonly G: "g";
    readonly MG: "mg";
    readonly L: "l";
    readonly ML: "ml";
    readonly CM: "cm";
    readonly MM: "mm";
    readonly KS: "ks";
    readonly BALENI: "balení";
};
