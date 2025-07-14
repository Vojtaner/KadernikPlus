import { Client } from "@prisma/client";

const mapToDomainClient = (prismaClient: {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  note: string | null;
}): Client => {
  return {
    id: prismaClient.id,
    firstName: prismaClient.firstName,
    lastName: prismaClient.lastName,
    phone: prismaClient.phone,
    note: prismaClient.note,
  };
};

export default mapToDomainClient;
