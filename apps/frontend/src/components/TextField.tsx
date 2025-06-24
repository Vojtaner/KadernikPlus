import { Controller } from 'react-hook-form'
import { TextField as MuiTextField, type SxProps, type Theme } from '@mui/material'
import { useAppFormContext, type AppFieldPath } from '../reactHookForm/store'

type TextFieldProps = {
  fieldPath: AppFieldPath
  sx?: SxProps<Theme>
  placeholder?: string
  onClick?: () => void
}

const TextField = (props: TextFieldProps) => {
  const { fieldPath, sx, placeholder, onClick } = props
  const { control } = useAppFormContext()

  return (
    <Controller
      control={control}
      name={fieldPath}
      render={({ field: { onChange, onBlur, value } }) => (
        <MuiTextField
          onClick={onClick}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          sx={sx}
          placeholder={placeholder}
        />
      )}
    />
  )
}

export default TextField
