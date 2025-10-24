import type { Dayjs } from 'dayjs';
import type { VisitDetailForm } from '../../reactHookForm/entity';
import {
  type VisitWithServicesHotFix,
  type CreateVisitType,
  type VisitDetailFormType,
  type VisitWithServicesWithProceduresWithStockAllowances,
  getVisitUrlComposed,
} from './entity';
import type { AxiosInstance } from 'axios';
import { apiCall } from '../entity';

export const visitApi = {
  get: (date?: Dayjs, query?: { from?: Dayjs; to?: Dayjs }) => getVisitUrlComposed(date, query),
  updateStatus: () => '/api/visits/status',
  delete: (visitId: string) => `/api/visits/client/${encodeURIComponent(visitId)}`,
  getById: (visitId: string) => `/api/visits/${encodeURIComponent(visitId)}`,
};

export const postCreateVisit = async (
  axios: AxiosInstance,
  visitData: CreateVisitType,
): Promise<CreateVisitType> =>
  apiCall(
    async () => await axios.post(visitApi.get(), visitData),
    'Návštěvu se nepodařilo vytvořit.',
  );

export const getVisitByVisitId = async (
  axios: AxiosInstance,
  visitId: string,
): Promise<VisitWithServicesHotFix> =>
  apiCall(async () => await axios.get(visitApi.getById(visitId)), 'Návštěva nenalezena.');

export const patchUpdateVisit = async (
  axios: AxiosInstance,
  visitId: string,
  visitData: VisitDetailFormType,
): Promise<VisitDetailForm> =>
  apiCall(
    async () => await axios.patch(visitApi.getById(visitId), visitData),
    'Úprava návštěvy neproběhla úspěšně.',
  );

export const deleteVisit = async (axios: AxiosInstance, visitId: string): Promise<string> =>
  apiCall(
    async () => await axios.delete(visitApi.delete(visitId)),
    'Nepovedlo se smazat návštěvu.',
  );

export const patchUpdateVisitStatus = async (
  axios: AxiosInstance,
  data: { visitId?: string; status: boolean },
) =>
  apiCall(
    async () => await axios.patch(visitApi.updateStatus(), data),
    'Úprava stavu návštěvy neúspěšná.',
  );

export const getVisits = async (
  axios: AxiosInstance,
  query?: { from?: Dayjs; to?: Dayjs },
  date?: Dayjs,
): Promise<VisitWithServicesWithProceduresWithStockAllowances[]> =>
  apiCall(async () => await axios.get(visitApi.get(date, query)), 'Návštěvy nenalezeny.');
