export type Service = {
    id: string;
    serviceName: string;
    basePrice: number;
};
export type ServiceCreateData = Omit<Service, "id">;
