import type { AxiosError } from 'axios'

export function extractErrorMessage(error: unknown, fallback = 'Došlo k neznámé chybě.') {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as AxiosError<{ message: string }>).response?.data?.message === 'string'
  ) {
    return (error as AxiosError<{ message: string }>).response?.data.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
