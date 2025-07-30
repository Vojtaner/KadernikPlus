import Stack from '@mui/material/Stack'
import { firstNameValidationrule, phoneValidationRule } from './FormDialog/AddOrUpdateClientItemButton'
import TextField from './TextField'
import type { Control, FieldValues } from 'react-hook-form'
import type { Visit } from '../../../entities/visit'

type AddNewClientFormProps<TFieldValues extends FieldValues> = { control: Control<TFieldValues> }

const AddNewClientForm = (props: AddNewClientFormProps<Visit>) => {
  const { control } = props

  return (
    <Stack spacing={1} padding={1}>
      <TextField
        fieldPath="lastName"
        control={control}
        label="Jméno"
        type="text"
        fullWidth
        rules={firstNameValidationrule}
      />
      <TextField
        fieldPath="lastName"
        control={control}
        label="Přijmení"
        type="text"
        fullWidth
        rules={firstNameValidationrule}
      />
      <TextField fieldPath="phone" control={control} label="Telefon" type="tel" fullWidth rules={phoneValidationRule} />
      <TextField
        fieldPath="note"
        control={control}
        label="Poznámka"
        type="text"
        multiline
        minRows={2}
        maxRows={10}
        fullWidth
      />
    </Stack>
  )
}

export default AddNewClientForm
