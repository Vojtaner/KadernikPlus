import { Client, Prisma } from ".prisma/client";

export type ClientWithVisits = Prisma.ClientGetPayload<{
  include: { visits: true };
}>;

export type ClientWithVisitsAndServices = Prisma.ClientGetPayload<{
  include: {
    visits: {
      include: { visitServices: { include: { service: true } } };
    };
  };
}>;

const mapToDomainClient = (prismaClient: {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  note: string | null;
  deposit: boolean;
}): Omit<Client, "userId" | "teamId"> => {
  return {
    id: prismaClient.id,
    firstName: prismaClient.firstName,
    lastName: prismaClient.lastName,
    phone: prismaClient.phone,
    note: prismaClient.note,
    deposit: prismaClient.deposit ?? false,
  };
};

export default mapToDomainClient;
