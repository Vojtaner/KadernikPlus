import { Client } from "@prisma/client";

const mapToDomainClient = (prismaClient: {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  note: string | null;
  birthDate: Date | null;
}): Client => {
  return {
    id: prismaClient.id,
    name: prismaClient.name,
    phone: prismaClient.phone,
    email: prismaClient.email,
    note: prismaClient.note,
    birthDate: prismaClient.birthDate,
  };
};

export default mapToDomainClient;
