import type { ButtonProps } from '@mui/material'
import type { CommonProps } from '@mui/material/OverridableComponent'
import { cloneElement, type ReactElement } from 'react'
import type { AppPaletteColor } from '../entity'
import type { StockViewKey } from '../entities/stock-allowance'

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

export const getButtonStyle = (tabelView: StockViewKey, key: StockViewKey) => {
  return tabelView === key ? 'contained' : 'text'
}
