import { Stack, Box, Button, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { getDateTimeFromUtcToLocal, type CreateVisitType } from '../entity'
import BasicDateTimePicker from '../../../app/components/BasicDateTimePicker'
import TextField from '../../../app/components/TextField'
import Switch from '../../../app/components/Switch/SwitchButton'
import { FormattedMessage, useIntl } from 'react-intl'
import ClientAutoComplete from '../../client/components/ClientAutoComplete'
import ServicesAutoComplete from '../../service/components/ServicesAutoComplete'
import { useCreateVisitMutation, useVisitsQuery } from '../queries'
import { firstNameValidationrule, phoneValidationRule } from '../../entity'
import { useParams } from 'react-router-dom'

export const useAddVisitForm = () => {
  const [isNewClient, setIsNewClient] = useState(false)
  const { control, resetField, handleSubmit, setValue } = useForm<CreateVisitType>({
    defaultValues: { depositRequired: false },
  })
  const date = useWatch({ control, name: 'date' })
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
    control,
    isNewClient,
    setValue,
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
  const { clientId } = useParams()
  const { control, isNewClient, setValue, setIsNewClient, resetField, depositRequired, visitsOnSelectedDate } = props

  return (
    <>
      <BasicDateTimePicker
        fieldPath="date"
        control={control}
        onAccept={(date) => date && setValue('dateTo', date)}
        rules={{
          validate: (value) => {
            if (!value) {
              return intl.formatMessage({
                defaultMessage: 'Musíte vybrat datum a čas',
                id: 'addVisitForm.chooseDateTime',
              })
            }

            const isTaken = visitsOnSelectedDate?.some(
              (visit) => getDateTimeFromUtcToLocal(visit.date) === getDateTimeFromUtcToLocal(value as Date)
            )

            return isTaken
              ? intl.formatMessage({
                  defaultMessage: 'Na tento čas máte již objednanou návštěvu.',
                  id: 'addVisitForm.visitTimeAlreadyBooked',
                })
              : true
          },
        }}
      />
      <BasicDateTimePicker fieldPath="dateTo" control={control} label="Datum do" />
      <Stack direction="row" spacing={1} alignItems="center">
        {!isNewClient && (
          <Box sx={{ flex: 9 }}>
            <ClientAutoComplete fieldPath="clientId" control={control} defaultValue={clientId ?? undefined} />
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
            <FormattedMessage id="addVisitForm.newClientButton" defaultMessage="Nový klient" />
          </Button>
        </Box>
      </Stack>
      {isNewClient && (
        <Stack spacing={1} padding={1}>
          <TextField
            fieldPath="firstName"
            control={control}
            label={intl.formatMessage({
              defaultMessage: 'Jméno',
              id: 'addVisitForm.firstName',
            })}
            type="text"
            fullWidth
            rules={firstNameValidationrule}
          />
          <TextField
            fieldPath="lastName"
            control={control}
            label={intl.formatMessage({
              defaultMessage: 'Přijmení',
              id: 'addVisitForm.lastName',
            })}
            type="text"
            fullWidth
            rules={firstNameValidationrule}
          />
          <TextField
            fieldPath="phone"
            control={control}
            label={intl.formatMessage({
              defaultMessage: 'Telefon',
              id: 'addVisitForm.phone',
            })}
            type="tel"
            fullWidth
            rules={phoneValidationRule}
          />
          <TextField
            fieldPath="clientNote"
            control={control}
            label={intl.formatMessage({
              defaultMessage: 'Informace o klientovi',
              id: 'addVisitForm.clientInfo',
            })}
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
              <FormattedMessage id="addVisitForm.depositRequiredSwitch" defaultMessage="Chci zálohu" />
            </Typography>
            <Switch control={control} fieldPath="depositRequired" />
          </Stack>
          {depositRequired && (
            <TextField
              fieldPath="deposit"
              label={intl.formatMessage({
                defaultMessage: 'Výše zálohy',
                id: 'addVisitForm.depositAmount',
              })}
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
