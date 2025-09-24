import type { AxiosInstance } from 'axios'
import type {
  ClientWithVisits,
  Client,
  ClientOrUpdateCreateData,
  ClientSearchPayload,
  ClientWithVisitsWithVisitServices,
} from '../../entities/client'
import type { VisitWithServicesWithProceduresWithStockAllowances } from '../visits/entity'
import type { Contact } from '../ContactPicker'
import { apiCall } from '../entity'

export const clientApi = {
  getById: (clientId: string) => `/api/clients/${encodeURIComponent(clientId)}`,
  getAll: () => `/api/clients/`,
  create: () => `/api/clients`,
  import: () => `/api/clients/import`,
  getVisits: (clientId: string) => `/api/visits/client/${encodeURIComponent(clientId)}`,
  search: (nameOrPhone: string) => `/api/clients/search?query=${encodeURIComponent(nameOrPhone)}`,
}

export const getClientById = async (axios: AxiosInstance, clientId: string): Promise<ClientWithVisits> =>
  apiCall(async () => await axios.get(clientApi.getById(clientId)), 'Zákazníka se nepovedlo najít.')

export const getClients = async (axios: AxiosInstance): Promise<Client[]> =>
  apiCall(async () => await axios.get(clientApi.getAll()), 'Zákazníky se nepovedlo najít.')

export const getClientVisits = async (
  axios: AxiosInstance,
  clientId: string
): Promise<VisitWithServicesWithProceduresWithStockAllowances[]> =>
  apiCall(async () => await axios.get(clientApi.getVisits(clientId)), 'Návštěvy se nepovedlo najít.')

export const postCreateNewClient = async (
  axios: AxiosInstance,
  clientData: ClientOrUpdateCreateData
): Promise<ClientOrUpdateCreateData> =>
  apiCall(async () => await axios.post(clientApi.create(), clientData), 'Klineta se nepodařilo vytvořit.')

export const postImportContacts = async (axios: AxiosInstance, data: { contacts: Contact[] }): Promise<boolean> =>
  apiCall(async () => await axios.post(clientApi.import(), data), 'Klienty se nepodařilo importovat.')

export const patchSearchClients = async (
  axios: AxiosInstance,
  payload: ClientSearchPayload
): Promise<ClientWithVisitsWithVisitServices[]> =>
  apiCall(async () => await axios.patch(clientApi.search(payload.nameOrPhone), payload), 'Klienty se nepovedlo najít.')
