import { Controller, type Control, type FieldPath, type FieldPathValue } from 'react-hook-form'
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
  keyExtractor: (item: T) => T['id']
  labelExtractor: (item: T) => string
  defaultValue?: FieldPathValue<AppFormState, FieldPath<AppFormState>>
}

const SelectField = <T extends Identifiable>(props: SelectFieldProps<T>) => {
  return (
    <Controller
      name={props.fieldPath}
      control={props.control}
      defaultValue={props.defaultValue}
      render={({ field }) => (
        <Select {...field}>
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
