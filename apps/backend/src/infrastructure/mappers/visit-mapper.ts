import { Visit } from "@/entities/visit";

const mapToDomainVisit = (prismaVisit: {
  id: string;
  clientId: string;
  userId: string;
  date: Date;
  note: string | null;
  paidPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}): Visit => {
  return {
    id: prismaVisit.id,
    clientId: prismaVisit.clientId,
    userId: prismaVisit.userId,
    date: prismaVisit.date,
    note: prismaVisit.note,
    paidPrice: prismaVisit.paidPrice,
    // createdAt and updatedAt are typically not part of core domain entity for simple CRUD
  };
};

export default mapToDomainVisit;
