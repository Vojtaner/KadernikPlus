import { useMutation, useQuery, type UseMutationOptions } from '@tanstack/react-query'
import { deleteProcedure, getProcedures, postNewProcedure } from './api'
import { useAxios } from '../../axios/axios'
import { useAddSnackbarMessage } from '../../hooks/useAddSnackBar'
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup'
import type { CreateProcedure, PostNewProcedure } from '../../entities/procedure'

export const useProceduresQuery = (visitId: string | undefined) => {
  const axios = useAxios()

  return useQuery<CreateProcedure[]>({
    queryKey: ['procedures', visitId],
    queryFn: () => {
      if (!visitId) {
        throw new Error('Stock ID is required to fetch stock items.')
      }
      const procedures = getProcedures(axios, visitId)

      return procedures
    },
  })
}

export const useProceduresMutation = (options?: UseMutationOptions<CreateProcedure, unknown, PostNewProcedure>) => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  const mutation = useMutation({
    mutationFn: (data: PostNewProcedure) => postNewProcedure(axios, data.visitId, data),

    onSuccess: (data: CreateProcedure, variables, context) => {
      options?.onSuccess?.(data, variables, context)
      queryClient.invalidateQueries({ queryKey: ['procedures', data.visitId] })
      queryClient.invalidateQueries({ queryKey: ['stockItems'] })
      addSnackBarMessage({ text: 'Procedura byla upravena.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: 'Proceduru se nepovedlo upravit.', type: 'error' })
      console.error(error)
    },
  })

  return { mutation }
}

export const useDeleteProcedureMutation = (options?: UseMutationOptions<string, unknown, string>) => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  const mutation = useMutation({
    mutationFn: (procedureId: string) => deleteProcedure(axios, procedureId),

    onSuccess: (procedureId: string, variables, context) => {
      options?.onSuccess?.(procedureId, variables, context)
      queryClient.invalidateQueries({ queryKey: ['procedures', procedureId] })
      queryClient.invalidateQueries({ queryKey: ['stockItems'] })
      addSnackBarMessage({ text: 'Procedura byla smazána.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: 'Proceduru se nepovedlo smazat.', type: 'error' })
      console.error(error)
    },
  })

  return { mutation }
}
