import Stack from '@mui/material/Stack'
import TextField from '../../../app/components/TextField'
import type { Control } from 'react-hook-form'
import { firstNameValidationrule, phoneValidationRule } from '../../entity'
import { useIntl } from 'react-intl'

type AddNewClientFormProps = {
  control: Control<AddNewClientFields>
}

type AddNewClientFields = {
  firstName: string
  lastName: string
  phone: string
  note?: string
}

function AddNewClientForm(props: AddNewClientFormProps) {
  const { control } = props
  const intl = useIntl()

  return (
    <Stack spacing={1} padding={1}>
      <TextField
        fieldPath="firstName"
        control={control}
        label={intl.formatMessage({ defaultMessage: 'Jméno', id: 'clienForm.firstName' })}
        type="text"
        fullWidth
        rules={firstNameValidationrule}
      />
      <TextField
        fieldPath="lastName"
        control={control}
        label={intl.formatMessage({ defaultMessage: 'Příjmení', id: 'clienForm.lastName' })}
        type="text"
        fullWidth
        rules={firstNameValidationrule}
      />
      <TextField fieldPath="phone" control={control} label="Telefon" type="tel" fullWidth rules={phoneValidationRule} />
      <TextField
        fieldPath="note"
        control={control}
        label={intl.formatMessage({ defaultMessage: 'Informace o klientovi', id: 'clienForm.clientInfo' })}
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
