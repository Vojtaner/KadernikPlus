import { Stack } from '@mui/material'
import TextField from '../../app/components/TextField'
import { firstNameValidationrule, phoneValidationRule } from '../../components/entity'
import { useIntl } from 'react-intl'
import { useCreateNewOrUpdateClientMutation } from '../../queries'
import { useForm, type Control } from 'react-hook-form'
import type { EditClient, NewClient } from '../../entities/client'

type ClientFormProps = { control: Control<NewClient | EditClient> }

const ClientForm = (props: ClientFormProps) => {
  const intl = useIntl()
  const { control } = props

  return (
    <Stack spacing={1} padding={1}>
      <TextField
        fieldPath="firstName"
        control={control}
        label={intl.formatMessage({ defaultMessage: 'Jméno', id: 'client.firstName' })}
        type="text"
        fullWidth
        rules={firstNameValidationrule}
      />
      <TextField
        fieldPath="lastName"
        control={control}
        label={intl.formatMessage({ defaultMessage: 'Příjmení', id: 'client.lastName' })}
        type="text"
        fullWidth
        rules={firstNameValidationrule}
      />
      <TextField fieldPath="phone" control={control} label="Telefon" type="tel" fullWidth rules={phoneValidationRule} />
      <TextField
        fieldPath="note"
        control={control}
        label={intl.formatMessage({ defaultMessage: 'Informace o klientovi', id: 'client.note' })}
        type="text"
        multiline
        minRows={2}
        maxRows={10}
        fullWidth
      />
    </Stack>
  )
}

export default ClientForm

export const useClientForm = (defaultValues?: NewClient | EditClient) => {
  const { mutate: createOrUpdateClientMutation } = useCreateNewOrUpdateClientMutation()
  const { control, reset, handleSubmit } = useForm<NewClient | EditClient>({ defaultValues: { ...defaultValues } })

  const resetClientForm = () => reset({ firstName: undefined, lastName: undefined, note: undefined, phone: undefined })

  return {
    resetClientForm,
    control,
    createOrUpdateClientMutation,
    handleSubmit,
  }
}
