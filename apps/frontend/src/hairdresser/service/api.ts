import type { AxiosInstance } from 'axios';
import type { Service, ServiceCreateOrUpdateData } from '../../entities/service';
import { apiCall } from '../entity';

export const serviceApi = {
  getAll: () => '/api/services',
};

export const getServices = async (axios: AxiosInstance): Promise<Service[]> =>
  apiCall(async () => await axios.get(serviceApi.getAll()), 'Služby se nepovedlo najít.');

export const postCreateOrUpdateService = async (
  axios: AxiosInstance,
  serviceData: ServiceCreateOrUpdateData,
): Promise<Service> =>
  apiCall(
    async () => await axios.post(serviceApi.getAll(), serviceData),
    'Službu se nepovedlo upravit/vytvořit.',
  );
