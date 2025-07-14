import { Controller, type Control, type FieldPath } from 'react-hook-form'
import { UnitsObject } from '../../../entities/stock-item'
import type { AppFormState } from '../reactHookForm/entity'
import { MenuItem, Select, type SxProps, type Theme } from '@mui/material'

export type Unit = (typeof UnitsObject)[keyof typeof UnitsObject]

type Identifiable = {
  id: string | number
  name: string
}

type SelectFieldProps<T extends Identifiable> = {
  control: Control<AppFormState>
  fieldPath: FieldPath<AppFormState>
  sx?: SxProps<Theme>
  items: T[]
  label: string
  keyExtractor: (item: T) => T['id']
  labelExtractor: (item: T) => string
}

const SelectField = <T extends Identifiable>(props: SelectFieldProps<T>) => {
  return (
    <Controller
      name={props.fieldPath}
      control={props.control}
      render={({ field }) => (
        <Select {...field} label={props.label}>
          {props.items.map((item) => (
            <MenuItem key={props.keyExtractor(item)} value={props.keyExtractor(item)}>
              {props.labelExtractor(item)}
            </MenuItem>
          ))}
        </Select>
      )}
    />
  )
}

export default SelectField
