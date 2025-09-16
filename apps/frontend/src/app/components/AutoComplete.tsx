import { Autocomplete, TextField } from '@mui/material'
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import type { Identifiable } from './SelectField'
import type { SyntheticEvent } from 'react'

type AutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  options: Identifiable[] | []
  label: string
  onChange?: (event: SyntheticEvent) => void
  defaultValue?: FieldPathValue<TFieldValues, Path<TFieldValues>> | undefined
  placeholder?: string
  disabled?: boolean
}

function AutoComplete<TFieldValues extends FieldValues>({
  fieldPath,
  control,
  options,
  label,
  onChange,
  defaultValue,
  placeholder,
  disabled,
}: AutoCompleteProps<TFieldValues>) {
  return (
    <Controller
      name={fieldPath}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <Autocomplete
            noOptionsText="Žádné možnosti"
            options={options}
            disabled={disabled}
            getOptionLabel={(option) => option.name}
            value={options.find((option) => option.id === field.value) || null}
            onChange={(e, selectedClient) => {
              onChange?.(e)
              field.onChange(selectedClient?.id ?? null)
            }}
            renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        )
      }}
    />
  )
}

export default AutoComplete
