import type { ButtonProps } from '@mui/material'
import type { CommonProps } from '@mui/material/OverridableComponent'
import { cloneElement, type ReactElement } from 'react'
import type { AppPaletteColor } from '../entity'

export const addPropsToReactElement = (
  element: ReactElement,
  props: ButtonProps & CommonProps & { color: AppPaletteColor }
) => {
  return cloneElement(element, { ...props })
}
