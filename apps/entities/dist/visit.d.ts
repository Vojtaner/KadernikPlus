import { Client } from "client";
import { Service } from "service";
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
    serviceIds: string[];
};
export type VisitCreateData = Visit;
export type GetVisitsType = Omit<Visit, "serviceIds" | "id"> & {
    services: Service[];
    client: WithUserId<Client>;
    id: string;
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
export type VisitDetailFormType = Pick<Visit, "date" | "paidPrice" | "deposit" | "depositStatus" | "hairdresserId">;
