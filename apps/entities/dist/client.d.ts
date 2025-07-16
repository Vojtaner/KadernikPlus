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
};
/**
 * Interface for creating a new Client.
 */
export type ClientCreateData = Omit<Client, "id">;
