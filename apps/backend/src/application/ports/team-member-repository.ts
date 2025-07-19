import { TeamMember } from "@prisma/client";

export type TeamMemberRepositoryPort = {
  create: (data: {
    userId: string;
    teamId: string;
    canAccessStocks: boolean;
    canAccessClients: boolean;
    canAccessVisits: boolean;
  }) => Promise<{
    id: string;
    userId: string;
    teamId: string;
    canAccessStocks: boolean;
    canAccessClients: boolean;
    canAccessVisits: boolean;
  }>;
  findMany: (teamId: string) => Promise<
    {
      id: string;
      userId: string;
      teamId: string;
      canAccessStocks: boolean;
      canAccessClients: boolean;
      canAccessVisits: boolean;
    }[]
  >;
  findUniqueMember: (userId: string) => Promise<TeamMember | null>;
};
