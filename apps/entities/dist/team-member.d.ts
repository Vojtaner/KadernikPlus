export type TeamMember = {
    userId: string;
    teamId: string;
    id: string;
} & Permissions;
export type TeamSettings = {
    name: string;
    id: string;
    canAccessStocks: boolean;
    canAccessClients: boolean;
    canAccessVisits: boolean;
};
export declare const DEFAULT_USERS_TEAM = "users-team";
export declare const DEFAULT_STOCK = "default-stock";
export type Permissions = {
    canAccessStocks: boolean;
    canAccessClients: boolean;
    canAccessVisits: boolean;
};
