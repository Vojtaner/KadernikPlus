import { Controller } from 'react-hook-form'
import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from '@mui/material'
import { useAppFormContext, type AppFieldPath } from '../reactHookForm/store'

type TextFieldProps = MuiTextFieldProps & {
  fieldPath: AppFieldPath
}

const TextField = (props: TextFieldProps) => {
  const { fieldPath, ...rest } = props
  const { control } = useAppFormContext()

  return (
    <Controller
      control={control}
      name={fieldPath}
      render={({ field: { onChange, onBlur, value } }) => (
        <MuiTextField onChange={onChange} onBlur={onBlur} value={value} {...rest} />
      )}
    />
  )
}

export default TextField
