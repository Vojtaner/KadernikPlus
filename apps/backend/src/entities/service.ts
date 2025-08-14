export type Service = {
  id: string;
  serviceName: string;
  basePrice: number;
  userId?: string;
  teamId: string;
};

//možná tu teamId bude konfliktit byllo ?

export type ServiceCreateOrUpdateData = Omit<Service, "id"> & { id?: string };
