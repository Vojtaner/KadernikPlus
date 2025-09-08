import type { AxiosInstance } from 'axios'
import type { Service, ServiceCreateOrUpdateData } from '../../entities/service'

export const serviceApi = {
  getAll: () => `/api/services`,
}

export const getServices = async (axios: AxiosInstance): Promise<Service[]> => {
  const response = await axios.get(serviceApi.getAll())
  return response.data
}

export const postCreateOrUpdateService = async (
  axios: AxiosInstance,
  serviceData: ServiceCreateOrUpdateData
): Promise<Service> => {
  const response = await axios.post(serviceApi.getAll(), serviceData)
  return response.data
}
