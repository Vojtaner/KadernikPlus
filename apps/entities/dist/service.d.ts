export type Service = {
    id: string;
    serviceName: string;
    basePrice: number;
    userId?: string;
    teamId?: string;
};
export type ServiceCreateData = Omit<Service, "id">;
