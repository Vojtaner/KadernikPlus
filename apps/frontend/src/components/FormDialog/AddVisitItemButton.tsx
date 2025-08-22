import { Box, Button, Stack, Typography } from '@mui/material'
import FormDialog from '../Dialog'
import MenuIconButton from '../MenuIconButton'
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined'
import BasicDateTimePicker from '../DateTimePicker'
import ClientAutoComplete from '../AutoCompletes/ClientAutoComplete'
import HairCutAutoComplete from '../AutoCompletes/HairCutAutoComplete'
import { useCreateVisitMutation, useVisitsQuery } from '../../queries'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import type { Visit } from '../../entities/visit'
import TextField from '../TextField'
import { firstNameValidationrule, phoneValidationRule } from './AddOrUpdateClientItemButton'
import { useAddSnackbarMessage } from '../../hooks/useAddSnackBar'
import { useScrollToTheTop } from './AddProcedureButton'
import dayjs from 'dayjs'
import { getDateTimeFromUtcToLocal } from '../../pages/VisitsList'
import Switch from '../../pages/SwitchButton'

export const AddVisitItemButton = () => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const [open, setOpen] = useState(false)
  const [isNewClient, setIsNewClient] = useState(false)
  const { control, resetField, handleSubmit } = useForm<Visit & { depositRequired: boolean }>()
  const date = useWatch({ control, name: 'date' })
  const { data: visitDataByDate } = useVisitsQuery({ date: dayjs(date) })
  const scroll = useScrollToTheTop()

  const { mutate: createVisitMutation } = useCreateVisitMutation({
    onSuccess: () => {
      addSnackbarMessage({ type: 'success', text: 'Návštěva byla vytvořena.' })
      setIsNewClient(false)
      resetField('clientId')
      resetField('serviceIds')
    },
  })
  const depositRequired = useWatch({ control, name: 'depositRequired' })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setIsNewClient(false)
    setOpen(false)
    scroll()
  }

  const onSubmit = (data: Visit) => {
    createVisitMutation(data)
    handleClose()
    scroll()
  }

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={
        <>
          <BasicDateTimePicker
            fieldPath="date"
            control={control}
            rules={{
              validate: (value) => {
                if (!value) {
                  return 'Musíte vybrat datum a čas'
                }

                const isTaken = visitDataByDate?.some(
                  (visit) => getDateTimeFromUtcToLocal(visit.date) === getDateTimeFromUtcToLocal(value as Date)
                )

                return isTaken ? 'Na tento čas máte již objednanou návštěvu.' : true
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
                Nový klient
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
                fieldPath="note"
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
                  Chci zálohu
                </Typography>
                <Switch control={control} fieldPath="depositRequired" />
              </Stack>
              {depositRequired && (
                <TextField fieldPath="deposit" label="Výše zálohy" type="number" fullWidth control={control} required />
              )}
            </Stack>
          )}
          <HairCutAutoComplete fieldPath="serviceIds" control={control} />
        </>
      }
      handleSubmit={() => handleSubmit(onSubmit)}
      onOpenButton={
        <MenuIconButton icon={<MoreTimeOutlinedIcon fontSize="large" />} onClick={handleClickOpen} title="Objednat" />
      }
      title="Objednat"
    />
  )
}

export default AddVisitItemButton
