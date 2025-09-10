import { TeamMember } from ".prisma/client";

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
  findMany: (
    teamId: string,
    userId: string
  ) => Promise<
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
  update: (data: {
    canAccessStocks?: boolean;
    canAccessClients?: boolean;
    canAccessVisits?: boolean;
    userId: string;
    teamId: string;
  }) => Promise<TeamMember | null>;
  delete: (teamMemberRowId: string) => Promise<void>;
  findAll: (userId: string) => Promise<TeamMember[]>;
};
