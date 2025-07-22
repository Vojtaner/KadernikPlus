/**
 * Represents a Client entity in the domain.
 * This interface defines the core properties of a client (customer).
 */
export type Client = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    note?: string | null;
    deposit: boolean;
    userId?: string;
    teamId?: string;
};
/**
 * Interface for creating a new Client.
 */
export type ClientCreateData = Client;
export type ClientWithVisits = Client & {
    visits: {
        id: string;
        deposit: number | null;
        note: string | null;
        userId: string;
        teamId: string;
        clientId: string;
        date: Date;
        depositStatus: Number | null;
        visitStatus: boolean | null;
        paidPrice: Number | null;
    }[];
};
