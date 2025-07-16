import {
  Controller,
  get,
  useFormState,
  type Control,
  type FieldPath,
  type FieldPathValue,
  type RegisterOptions,
} from 'react-hook-form'
import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from '@mui/material'
import { type AppFormState } from '../reactHookForm/entity'

export type TextFieldProps<
  TFieldValues extends Record<string, string | number | null | Date | string[]> = AppFormState, //formulářový state,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>, //defaultování na cestu ve formuláři pokud není zadaná
> = Omit<MuiTextFieldProps, 'name' | 'defaultValue' | 'value' | 'onChange' | 'onBlur'> & {
  fieldPath: TName
  control?: Control<TFieldValues>
  rules?: Omit<RegisterOptions<TFieldValues, TName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
  defaultValue?: FieldPathValue<TFieldValues, TName>
  disabled?: boolean
}

function TextField<
  TFieldValues extends Record<string, string | number | null | Date | string[]> = AppFormState,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: TextFieldProps<TFieldValues, TName>) {
  const { fieldPath, control, rules, defaultValue, disabled, ...rest } = props
  const { errors } = useFormState({ control, name: fieldPath })

  const error: string = get(errors, fieldPath)?.message

  return (
    <Controller
      control={control}
      name={fieldPath}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <MuiTextField
          {...rest}
          onChange={onChange}
          onBlur={onBlur}
          value={value ?? ''}
          name={fieldPath}
          inputRef={ref}
          helperText={error}
          error={!!error}
          disabled={disabled}
        />
      )}
    />
  )
}

export default TextField
