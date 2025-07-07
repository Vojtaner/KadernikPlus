/**
 * Represents a Client entity in the domain.
 * This interface defines the core properties of a client (customer).
 */
export interface Client {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  note?: string | null;
  birthDate?: Date | null;
}

/**
 * Interface for creating a new Client.
 */
export interface ClientCreateData {
  name: string;
  phone?: string;
  email?: string;
  note?: string;
  birthDate?: Date;
}
