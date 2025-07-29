import { Controller, type Control, type FieldPath, type FieldPathValue, type FieldValues } from 'react-hook-form'
import { UnitsObject } from '../../../entities/stock-item'
import { MenuItem, Select, type SxProps, type Theme } from '@mui/material'

export type Unit = (typeof UnitsObject)[keyof typeof UnitsObject]

type Identifiable = {
  id: string | number
  name: string
}

type SelectFieldProps<T extends Identifiable, TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  fieldPath: FieldPath<TFieldValues>
  sx?: SxProps<Theme>
  items: T[]
  keyExtractor: (item: T) => T['id']
  labelExtractor: (item: T) => string
  defaultValue?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
}

const SelectField = <T extends Identifiable, TFieldValues extends FieldValues>(
  props: SelectFieldProps<T, TFieldValues>
) => {
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
