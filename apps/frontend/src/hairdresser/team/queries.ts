import { useQuery, useMutation } from '@tanstack/react-query'
import { useAxios } from '../../axios/axios'
import { type TeamMember, DEFAULT_USERS_TEAM } from '../../entities/team-member'
import { useAddSnackbarMessage } from '../../hooks/useAddSnackBar'
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup'
import { getTeamMember, postInviteTeamMember, deleteTeamMember, patchTeamMemberSkill, getTeamMembers } from './api'

export const useTeamMemberQuery = () => {
  const axios = useAxios()

  return useQuery<TeamMember>({
    queryKey: ['teamMember'],
    queryFn: () => getTeamMember(axios),
  })
}

export type SkillUpdateInput = {
  memberId: string
  canAccessStocks: boolean
  canAccessClients: boolean
  canAccessVisits: boolean
}

export const useAddTeamMemberMutation = () => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation({
    mutationFn: (data: { email: string; consentId: string }) => postInviteTeamMember(axios, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
      addSnackBarMessage({ text: 'Člen týmu byl přidán.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: error.message, type: 'error' })
    },
  })
}

export const useDeleteTeamMemberMutation = () => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation({
    mutationFn: (id: string) => deleteTeamMember(axios, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
      addSnackBarMessage({ text: 'Člen týmu byl odebrán.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: 'Nepovedlo se odebrat člena týmu.', type: 'error' })
      console.error(error)
    },
  })
}

export const useUpdateTeamMemberSkill = (teamId?: string) => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation({
    mutationFn: (data: SkillUpdateInput) => {
      if (!teamId) {
        throw new Error('Team ID not found.')
      }
      return patchTeamMemberSkill(axios, data, teamId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
      addSnackBarMessage({ text: 'Oprávnění byla v týmu byla upravena.', type: 'success' })
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
      addSnackBarMessage({ text: 'Oprávnění v týmu se nepodařilo upravit.', type: 'error' })
      console.error(error)
    },
  })
}

export const useTeamMembersQuery = (teamId?: string) => {
  const axios = useAxios()

  const resolvedTeamId = teamId || DEFAULT_USERS_TEAM

  return useQuery<(TeamMember & { user: { name: string } })[]>({
    queryKey: ['teamMembers', resolvedTeamId],
    queryFn: () => getTeamMembers(axios, resolvedTeamId),
  })
}
