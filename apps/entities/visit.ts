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
  userId?: string;

  serviceIds: string[];
};

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
} & Omit<Visit, "id" | "visitStatus" | "hairdresserId">;

type VisitService = {
  id: string;
  service: Service;
  serviceId: string;
  visitId: string;
};

{
  /* záloha stav - selectfield - depositStatus
   záloha výše - textfield - deposit
   datum - datetimepicker - date
   kadeřnice - autocomplete */
}
{
  /* stav návštěvy*/
}

export enum DepositStatus {
  NEZAPLACENO = "NEZAPLACENO",
  ZAPLACENO = "ZAPLACENO",
  BEZ_ZALOHY = "BEZ ZÁLOHY",
}

export const depositStatusOptions = Object.entries(DepositStatus).map(
  ([key, value]) => ({
    id: key,
    name: value,
  })
);

export type VisitDetailFormType = Pick<
  Visit,
  "date" | "paidPrice" | "deposit" | "depositStatus" | "hairdresserId"
>;
