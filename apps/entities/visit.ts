import { Client } from "client";
import { Service } from "service";
import { WithUserId } from "user";

export type Visit = {
  id?: string;
  clientId: string;
  date: Date;
  paidPrice?: number;
  deposit?: number;
  depositStatus?: "NEZAPLACENO" | "ZAPLACENO" | "BEZ ZÁLOHY";
  visitStatus?: boolean;
  note?: string | null;
  serviceIds: string[];
};

export type VisitCreateData = Visit;

export type GetVisitsType = Omit<Visit, "serviceIds" | "id"> & {
  services: Service[];
  client: WithUserId<Client>;
  id: string;
};
