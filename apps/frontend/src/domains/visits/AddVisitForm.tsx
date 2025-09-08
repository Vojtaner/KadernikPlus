import { Stack, Box, Button, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import type { CreateVisitType } from './entity'
import { getDateTimeFromUtcToLocal } from './VisitsList'
import { useVisitsQuery, useCreateVisitMutation } from '../../queries'
import ServicesAutoComplete from '../service/ServicesAutoComplete'
import BasicDateTimePicker from '../../app/components/BasicDateTimePicker'
import TextField from '../../app/components/TextField'
import Switch from '../../app/components/Switch/SwitchButton'
import { FormattedMessage, useIntl } from 'react-intl'
import { firstNameValidationrule, phoneValidationRule } from '../../components/entity'
import ClientAutoComplete from '../client/ClientAutoComplete'

export const useAddVisitForm = () => {
  const [isNewClient, setIsNewClient] = useState(false)
  const { control, resetField, handleSubmit } = useForm<CreateVisitType>({ defaultValues: { depositRequired: false } })
  const date = useWatch({ control, name: 'date' })
  const intl = useIntl()
  const depositRequired = useWatch({ control, name: 'depositRequired' })
  const { data: visitsOnSelectedDate } = useVisitsQuery({ date: dayjs(date) })

  const { mutate: createVisitMutation } = useCreateVisitMutation({
    onSuccess: () => {
      setIsNewClient(false)
      resetField('clientId')
      resetField('serviceIds')
    },
  })

  return {
    title: intl.formatMessage({ defaultMessage: 'Objednat', id: 'addVisit.order' }),
    control,
    isNewClient,
    setIsNewClient,
    resetField,
    depositRequired,
    visitsOnSelectedDate,
    handleSubmit,
    createVisitMutation,
  }
}

type AddVisitFormProps = Omit<ReturnType<typeof useAddVisitForm>, 'handleSubmit' | 'createVisitMutation' | 'title'>

const AddVisitForm = (props: AddVisitFormProps) => {
  const intl = useIntl()
  const { control, isNewClient, setIsNewClient, resetField, depositRequired, visitsOnSelectedDate } = props

  return (
    <>
      <BasicDateTimePicker
        fieldPath="date"
        control={control}
        rules={{
          validate: (value) => {
            if (!value) {
              return intl.formatMessage({ defaultMessage: 'Musíte vybrat datum a čas', id: 'addVisit.chooseDateTime' })
            }

            const isTaken = visitsOnSelectedDate?.some(
              (visit) => getDateTimeFromUtcToLocal(visit.date) === getDateTimeFromUtcToLocal(value as Date)
            )

            return isTaken
              ? intl.formatMessage({
                  defaultMessage: 'Na tento čas máte již objednanou návštěvu.',
                  id: 'addVisit.visitTimeAlreadyBooked',
                })
              : true
          },
        }}
      />
      <Stack direction="row" spacing={1} alignItems="center">
        {!isNewClient && (
          <Box sx={{ flex: 9 }}>
            <ClientAutoComplete fieldPath="clientId" control={control} />
          </Box>
        )}
        <Box sx={{ flex: 3 }}>
          <Button
            size="small"
            fullWidth
            sx={{ lineHeight: '18px' }}
            onClick={() => {
              setIsNewClient((prev) => !prev)
              resetField('clientId')
            }}>
            <FormattedMessage id="addVisit.newClientButton" defaultMessage="Nový klient" />
          </Button>
        </Box>
      </Stack>
      {isNewClient && (
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
          <TextField
            fieldPath="phone"
            control={control}
            label="Telefon"
            type="tel"
            fullWidth
            rules={phoneValidationRule}
          />
          <TextField
            fieldPath="clientNote"
            control={control}
            label="Informace o klientovi"
            type="text"
            multiline
            minRows={2}
            maxRows={10}
            fullWidth
          />
          <Stack
            direction="row"
            alignItems="center"
            bgcolor="#dddddd"
            paddingX="1rem"
            borderRadius="10px"
            boxShadow="0px 1px 7px 0px rgba(0,0,0,0.12)">
            <Typography fontWeight={600} color="secondary.main">
              <FormattedMessage id="addVisit.depositRequiredSwitch" defaultMessage="Chci zálohu" />
            </Typography>
            <Switch control={control} fieldPath="depositRequired" />
          </Stack>
          {depositRequired && (
            <TextField
              fieldPath="depositAmount"
              label="Výše zálohy"
              type="number"
              fullWidth
              control={control}
              required
            />
          )}
        </Stack>
      )}
      <ServicesAutoComplete fieldPath="serviceIds" control={control} />
    </>
  )
}

export default AddVisitForm
