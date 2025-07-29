import { Client } from "client";
import { Procedure } from "procedure";
import { Service } from "service";
import { StockAllowance } from "stock-item";
import { WithUserId } from "user";
export type Visit = {
    id?: string;
    clientId: string;
    date: Date;
    paidPrice?: number;
    deposit?: number;
    depositStatus?: DepositStatus | null;
    visitStatus?: boolean;
    note?: string | null;
    hairdresserId?: string;
    userId?: string;
    serviceIds: string[];
} & Pick<Client, "firstName" | "lastName" | "phone" | "note">;
export type VisitCreateData = Visit;
export type GetVisitsType = Omit<Visit, "serviceIds" | "id"> & {
    services: Service[];
    client: WithUserId<Client>;
    id: string;
};
export type VisitWithServices = {
    client: {
        id: string;
        userId: string;
        note: string | null;
        deposit: boolean;
        teamId: string;
        firstName: string;
        lastName: string;
        phone: string | null;
    };
    visitServices: VisitService[];
    visitStatus: boolean;
} & Omit<Visit, "visitStatus" | "hairdresserId">;
export type VisitWithServicesWithProceduresWithStockAllowances = VisitWithServices & Procedure & StockAllowance;
type VisitService = {
    id: string;
    service: Service;
    serviceId: string;
    visitId: string;
};
export declare enum DepositStatus {
    NEZAPLACENO = "NEZAPLACENO",
    ZAPLACENO = "ZAPLACENO",
    BEZ_ZALOHY = "BEZ Z\u00C1LOHY"
}
export declare const depositStatusOptions: {
    id: string;
    name: DepositStatus;
}[];
export type VisitDetailFormType = Pick<Visit, "date" | "paidPrice" | "deposit" | "depositStatus" | "hairdresserId" | "note">;
export {};
