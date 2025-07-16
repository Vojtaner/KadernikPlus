export type Service = {
    id: string;
    serviceName: string;
    basePrice: number;
    userId?: string;
};
export type ServiceCreateData = Omit<Service, "id">;
