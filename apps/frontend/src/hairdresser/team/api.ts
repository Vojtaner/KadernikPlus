import type { User } from '@auth0/auth0-react'
import type { AxiosInstance } from 'axios'
import type { TeamMember } from '../../entities/team-member'
import type { VisitDetailForm } from '../../reactHookForm/entity'
import { extractErrorMessage } from '../../api/errorHandler'

export const teamApi = {
  get: () => `/api/team/`,
  getMembers: (teamId: string) => `/api/team-members/${encodeURIComponent(teamId)}`,
  getMember: () => `/api/team-members/`,
  inviteMember: () => `/api/team-members/invitation`,
}

export const getTeamMember = async (axios: AxiosInstance): Promise<TeamMember> => {
  try {
    const response = await axios.get(teamApi.getMember())

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Člen týmu nenalezen.'))
  }
}

export const postInviteTeamMember = async (
  axios: AxiosInstance,
  data: { email: string; consentId: string }
): Promise<TeamMember> => {
  try {
    const response = await axios.post(teamApi.inviteMember(), data)
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Nepovedlo se přidat člena týmu.'))
  }
}

export const patchTeamMemberSkill = async (
  axios: AxiosInstance,
  memberData: {
    canAccessStocks: boolean
    canAccessClients: boolean
    canAccessVisits: boolean
  },
  teamId: string
): Promise<VisitDetailForm> => {
  const response = await axios.patch(teamApi.getMembers(teamId), memberData)
  return response.data
}

export const getTeam = async (axios: AxiosInstance): Promise<User[]> => {
  try {
    const response = await axios.get(teamApi.get())

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Tým nenalezen.'))
  }
}

export const getTeamMembers = async (
  axios: AxiosInstance,
  teamId: string
): Promise<(TeamMember & { user: { name: string } })[]> => {
  try {
    const response = await axios.get(teamApi.getMembers(teamId))

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Členové týmu nenalezeni.'))
  }
}

export const deleteTeamMember = async (axios: AxiosInstance, id: string): Promise<TeamMember> => {
  try {
    const response = await axios.delete(teamApi.getMember(), { data: { id } })

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Člen týmu smazán.'))
  }
}
