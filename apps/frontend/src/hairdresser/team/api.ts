import type { User } from '@auth0/auth0-react';
import type { AxiosInstance } from 'axios';
import type { TeamMember } from '../../entities/team-member';
import type { VisitDetailForm } from '../../reactHookForm/entity';
import { apiCall } from '../entity';

export const teamApi = {
  get: () => `/api/team/`,
  getMembers: (teamId: string) => `/api/team-members/${encodeURIComponent(teamId)}`,
  getMember: () => `/api/team-members/`,
  inviteMember: () => `/api/team-members/invitation`,
};

export const getTeamMember = async (axios: AxiosInstance): Promise<TeamMember> =>
  apiCall(async () => await axios.get(teamApi.getMember()), 'Člen týmu nenalezen.');

export const postInviteTeamMember = async (
  axios: AxiosInstance,
  data: { email: string; consentId: string }
): Promise<TeamMember> =>
  apiCall(
    async () => await axios.post(teamApi.inviteMember(), data),
    'Nepovedlo se přidat člena týmu.'
  );

export const patchTeamMemberSkill = async (
  axios: AxiosInstance,
  memberData: {
    canAccessStocks: boolean;
    canAccessClients: boolean;
    canAccessVisits: boolean;
  },
  teamId: string
): Promise<VisitDetailForm> =>
  apiCall(
    async () => await axios.patch(teamApi.getMembers(teamId), memberData),
    'Oprávnění se nepodařilo upravit'
  );

export const getTeam = async (axios: AxiosInstance): Promise<User[]> =>
  apiCall(async () => await axios.get(teamApi.get()), 'Tým nenalezen.');

export const getTeamMembers = async (
  axios: AxiosInstance,
  teamId: string
): Promise<(TeamMember & { user: { name: string } })[]> =>
  apiCall(async () => await axios.get(teamApi.getMembers(teamId)), 'Členové týmu nenalezeni.');

export const deleteTeamMember = async (axios: AxiosInstance, id: string): Promise<TeamMember> =>
  apiCall(
    async () => await axios.delete(teamApi.getMember(), { data: { id } }),
    'Člen týmu smazán.'
  );
