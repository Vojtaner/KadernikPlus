import type { ButtonProps } from '@mui/material'
import type { CommonProps } from '@mui/material/OverridableComponent'
import { cloneElement, type ReactElement } from 'react'
import type { AppPaletteColor } from '../entity'
import type { AxiosError, AxiosResponse } from 'axios'
import { extractErrorMessage } from '../api/errorHandler'
import type { User } from '@auth0/auth0-react'
import { isWoman, vocative } from 'czech-vocative'
import { capitalizeFirstLetter } from './SmsTabs'

export const addPropsToReactElement = (
  element: ReactElement,
  props: ButtonProps & CommonProps & { color?: AppPaletteColor }
) => {
  return cloneElement(element, { ...props })
}

export const phoneValidationRule = {
  pattern: {
    value: /^\+?[0-9]{7,15}$/,
    message: 'Zadejte platné telefonní číslo.',
  },
  maxLength: {
    value: 9,
    message: 'Číslo musí mít 9 znaků.',
  },
  minLength: {
    value: 9,
    message: 'Číslo musí mít 9 znaků.',
  },
}
export const firstNameValidationrule = {
  minLength: {
    value: 3,
    message: 'Jméno musí mít alespoň 3 znaky.',
  },
}

export const getButtonStyles = (active: boolean) => ({
  lineHeight: '18px',
  backgroundColor: active ? 'primary.main' : undefined,
  color: active ? 'white' : undefined,
})

export const getButtonStyle = <T>(tabelView: T, key: T) => {
  return tabelView === key ? 'contained' : 'text'
}

export const getQueryErrorMessage = (error: unknown) => {
  return (error as AxiosError<{ message: string }>).response?.data.message
}

export const ApiError = (error: { message: string; statusCode: number }) => ({
  message: error.message,
  code: error.statusCode,
})

type ApiCall<T> = () => Promise<AxiosResponse<T>>

export const apiCall = async <T>(fn: ApiCall<T>, defaultErrorMessage: string): Promise<T> => {
  try {
    const response = await fn()
    return response.data
  } catch (e: unknown) {
    const error = e as AxiosError<{ message?: string; error?: string }>
    const errorObject = extractErrorMessage(error, defaultErrorMessage)
    throw ApiError(errorObject)
  }
}

export const getGreeting = (user?: User) => {
  if (!user?.family_name) {
    return ''
  }

  const title = isWoman(user.family_name) ? 'paní' : 'pane'
  const name = capitalizeFirstLetter(vocative(user.family_name))

  return `${title} ${name}`
}

export type Invoice = {
  invoiceNumber: string
  customerName: string
  customerEmail: string
  notes: string
  issuedAt: string
  status: 'PAID' | 'CANCELLED' | 'PENDING'
  amount: number
  currency: string
}
