import type { AxiosError } from 'axios'

export function extractErrorMessage(error: unknown, fallback = 'Došlo k neznámé chybě.') {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (typeof (error as AxiosError<{ message: string }>).response?.data?.message === 'string' ||
      typeof (error as AxiosError<{ error: string }>).response?.data?.error === 'string')
  ) {
    return (
      (error as AxiosError<{ message: string }>).response?.data.message ||
      (error as AxiosError<{ error: string }>).response?.data?.error
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
