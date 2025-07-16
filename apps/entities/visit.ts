export type Visit = {
  id?: string;
  clientId: string;
  date: Date;
  note?: string | null;
  serviceIds: string[];
};

export type VisitCreateData = Visit;
