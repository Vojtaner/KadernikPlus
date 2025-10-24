export type Service = {
  id: string;
  serviceName: string;
  basePrice: number;
  // userId?: string
  // teamId?: string
};
export type ServiceCreateOrUpdateData = Omit<Service, 'id'> & { id?: string };
