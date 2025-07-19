export type TeamMember = {
  userId: string;
  teamId: string;
  canAccessStocks: boolean;
  canAccessClients: boolean;
  canAccessVisits: boolean;
  id: string;
};

export type TeamSettings = {
  name: string;
  id: string;
  canAccessStocks: boolean;
  canAccessClients: boolean;
  canAccessVisits: boolean;
};

export const DEFAULT_USERS_TEAM = "users-team";
