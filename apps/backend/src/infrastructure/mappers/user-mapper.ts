import { User } from "@/entities/user";

const mapToDomainUser = (prismaUser: {
  id: string;
  name: string;
  email: string;
  authProvider: string | null;
  createdAt: Date;
  lastLogin: Date | null;
}): User => {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    authProvider: prismaUser.authProvider,
    createdAt: prismaUser.createdAt,
    lastLogin: prismaUser.lastLogin,
  };
};

export default mapToDomainUser;
