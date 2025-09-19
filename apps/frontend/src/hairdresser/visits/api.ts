import type { Dayjs } from 'dayjs'
import { extractErrorMessage } from '../../api/errorHandler'
import type { VisitDetailForm } from '../../reactHookForm/entity'
import {
  type VisitWithServicesHotFix,
  type CreateVisitType,
  type VisitDetailFormType,
  type VisitWithServicesWithProceduresWithStockAllowances,
  getVisitUrlComposed,
} from './entity'
import type { AxiosInstance } from 'axios'

export const visitApi = {
  get: (date?: Dayjs, query?: { from?: Dayjs; to?: Dayjs }) => getVisitUrlComposed(date, query),
  updateStatus: () => `/api/visits/status`,
  delete: (visitId: string) => `/api/visits/client/${encodeURIComponent(visitId)}`,
  getById: (visitId: string) => `/api/visits/${encodeURIComponent(visitId)}`,
}

export const getVisitByVisitId = async (axios: AxiosInstance, visitId: string): Promise<VisitWithServicesHotFix> => {
  try {
    const response = await axios.get(visitApi.getById(visitId))

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Návštěva nenalezena.'))
  }
}
export const postCreateVisit = async (axios: AxiosInstance, visitData: CreateVisitType): Promise<CreateVisitType> => {
  try {
    const response = await axios.post(visitApi.get(), visitData)

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Návštěvu se nepodařilo vytvořit.'))
  }
}

export const patchUpdateVisit = async (
  axios: AxiosInstance,
  visitId: string,
  visitData: VisitDetailFormType
): Promise<VisitDetailForm> => {
  try {
    const response = await axios.patch(visitApi.getById(visitId), visitData)

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Úprava návštěvy neproběhla úspěšně.'))
  }
}

export const deleteVisit = async (axios: AxiosInstance, visitId: string): Promise<string> => {
  try {
    const response = await axios.delete(visitApi.delete(visitId))
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Nepovedlo se smazat návštěvu.'))
  }
}

export const patchUpdateVisitStatus = async (axios: AxiosInstance, data: { visitId?: string; status: boolean }) => {
  try {
    const response = await axios.patch(visitApi.updateStatus(), data)

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Úprava stavu návštěvy neúspěšná.'))
  }
}
export const getVisits = async (
  axios: AxiosInstance,
  query?: { from?: Dayjs; to?: Dayjs },
  date?: Dayjs
): Promise<VisitWithServicesWithProceduresWithStockAllowances[]> => {
  try {
    const response = await axios.get(visitApi.get(date, query))

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Návštěvy nenalezeny.'))
  }
}
