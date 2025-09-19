import type { AxiosInstance } from 'axios'
import type { CreateProcedure, PostNewProcedure } from '../../entities/procedure'
import { extractErrorMessage } from '../../api/errorHandler'

export const procedureApi = {
  getByVisit: (visitId: string) => `/api/procedures/visit/${encodeURIComponent(visitId)}`,
  getById: (procedureId: string) => `/api/procedures/${encodeURIComponent(procedureId)}`,
}

export const getProcedures = async (axios: AxiosInstance, visitId: string): Promise<CreateProcedure[]> => {
  const response = await axios.get(procedureApi.getByVisit(visitId))
  return response.data
}
export const postNewProcedure = async (
  axios: AxiosInstance,
  visitId: string,
  data: PostNewProcedure
): Promise<CreateProcedure> => {
  try {
    const response = await axios.post(procedureApi.getByVisit(visitId), data)

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Proceduru se nepovedlo vytvořit.'))
  }
}

export const deleteProcedure = async (axios: AxiosInstance, procedureId: string): Promise<string> => {
  try {
    const response = await axios.delete(procedureApi.getById(procedureId))

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Proceduru se nepovedlo smazat.'))
  }
}
