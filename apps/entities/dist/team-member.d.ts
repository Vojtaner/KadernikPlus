export type TeamMember = {
    userId: string;
    teamId: string;
    canAccessStocks: boolean;
    canAccessClients: boolean;
    canAccessVisits: boolean;
};
