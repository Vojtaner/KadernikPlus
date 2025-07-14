/**
 * Represents a Visit entity in the domain.
 */
export interface Visit {
    id: string;
    clientId: string;
    userId: string;
    date: Date;
    note?: string | null;
    paidPrice: number;
}
/**
 * Interface for creating a new Visit.
 */
export interface VisitCreateData {
    clientId: string;
    userId: string;
    date: Date;
    note?: string;
    paidPrice: number;
}
export interface IVisitRepository {
}
