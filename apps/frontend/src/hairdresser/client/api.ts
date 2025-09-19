import type { AxiosInstance } from 'axios'
import { extractErrorMessage } from '../../api/errorHandler'
import type {
  ClientWithVisits,
  Client,
  ClientOrUpdateCreateData,
  ClientSearchPayload,
  ClientWithVisitsWithVisitServices,
} from '../../entities/client'
import type { VisitWithServicesWithProceduresWithStockAllowances } from '../visits/entity'
import type { Contact } from '../ContactPicker'

export const clientApi = {
  getById: (clientId: string) => `/api/clients/${encodeURIComponent(clientId)}`,
  getAll: () => `/api/clients/`,
  create: () => `/api/clients`,
  import: () => `/api/clients/import`,
  getVisits: (clientId: string) => `/api/visits/client/${encodeURIComponent(clientId)}`,
  search: (nameOrPhone: string) => `/api/clients/search?query=${encodeURIComponent(nameOrPhone)}`,
}

export const getClientById = async (axios: AxiosInstance, clientId: string): Promise<ClientWithVisits> => {
  try {
    const response = await axios.get(clientApi.getById(clientId))

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Zákazníka se nepovedlo najít.'))
  }
}
export const getClients = async (axios: AxiosInstance): Promise<Client[]> => {
  try {
    const response = await axios.get(clientApi.getAll())

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Zákazníky se nepovedlo najít.'))
  }
}

export const getClientVisits = async (
  axios: AxiosInstance,
  clientId: string
): Promise<VisitWithServicesWithProceduresWithStockAllowances[]> => {
  try {
    const response = await axios.get(clientApi.getVisits(clientId))

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Návštěvy se nepovedlo najít.'))
  }
}

export const postCreateNewClient = async (
  axios: AxiosInstance,
  clientData: ClientOrUpdateCreateData
): Promise<ClientOrUpdateCreateData> => {
  try {
    const response = await axios.post(clientApi.create(), clientData)

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Klineta se nepodařilo vytvořit.'))
  }
}
export const postImportContacts = async (axios: AxiosInstance, data: { contacts: Contact[] }): Promise<boolean> => {
  try {
    const response = await axios.post(clientApi.import(), data)

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Klienty se nepodařilo importovat.'))
  }
}

export const patchSearchClients = async (
  axios: AxiosInstance,
  payload: ClientSearchPayload
): Promise<ClientWithVisitsWithVisitServices[]> => {
  try {
    const response = await axios.patch(clientApi.search(payload.nameOrPhone), payload)

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Klienty se nepovedlo najít.'))
  }
}
