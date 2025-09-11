import Stack from '@mui/material/Stack'
import TextField from '../../../app/components/TextField'
import type { Control } from 'react-hook-form'
import { firstNameValidationrule, phoneValidationRule } from '../../entity'

type AddNewClientFormProps = {
  control: Control<AddNewClientFields>
}

type AddNewClientFields = {
  firstName: string
  lastName: string
  phone: string
  note?: string
}
//zde mi nefungovala typovost tak jsem to vyjmul pryč při vložení controlu mi to nevidělo hodnoty fielPath
function AddNewClientForm(props: AddNewClientFormProps) {
  const { control } = props

  return (
    <Stack spacing={1} padding={1}>
      <TextField
        fieldPath="firstName"
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
        label="Informace o klientovi"
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
