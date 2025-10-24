import type { AxiosError } from 'axios';

export function extractErrorMessage(
  error: AxiosError<{ message?: string; error?: string }>,
  fallback = 'Došlo k neznámé chybě.'
) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (typeof error.response?.data?.message === 'string' ||
      typeof error.response?.data?.error === 'string')
  ) {
    return {
      message:
        (error as AxiosError<{ message: string }>).response?.data.message ||
        (error as AxiosError<{ error: string }>).response?.data?.error ||
        fallback,
      statusCode: error.status ?? 500,
    };
  }

  if (error instanceof Error) {
    return { message: error.message, statusCode: error.status ?? 500 };
  }

  return { message: fallback, statusCode: 500 };
}
