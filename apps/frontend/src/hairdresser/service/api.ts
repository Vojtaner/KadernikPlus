import type { AxiosInstance } from 'axios'
import type { Service, ServiceCreateOrUpdateData } from '../../entities/service'
import { extractErrorMessage } from '../../api/errorHandler'

export const serviceApi = {
  getAll: () => `/api/services`,
}

export const getServices = async (axios: AxiosInstance): Promise<Service[]> => {
  try {
    const response = await axios.get(serviceApi.getAll())

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Služby se nepovedlo najít.'))
  }
}

export const postCreateOrUpdateService = async (
  axios: AxiosInstance,
  serviceData: ServiceCreateOrUpdateData
): Promise<Service> => {
  try {
    const response = await axios.post(serviceApi.getAll(), serviceData)

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Službu se nepovedlo upravit/vytvořit.'))
  }
}
