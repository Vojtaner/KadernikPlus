import { Box, Button, Stack } from '@mui/material'
import FormDialog from '../Dialog'
import MenuIconButton from '../MenuIconButton'
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined'
import BasicDateTimePicker from '../DateTimePicker'
import ClientAutoComplete from '../AutoCompletes/ClientAutoComplete'
import HairCutAutoComplete from '../AutoCompletes/HairCutAutoComplete'
import { useCreateVisitMutation } from '../../queries'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Visit } from '../../../../entities/visit'
import TextField from '../TextField'
import { firstNameValidationrule, phoneValidationRule } from './AddOrUpdateClientItemButton'
import { useAddSnackbarMessage } from '../../hooks/useAddSnackBar'

export const AddVisitItemButton = () => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const [open, setOpen] = useState(false)
  const [isNewClient, setIsNewClient] = useState(false)
  const { control, resetField, handleSubmit } = useForm<Visit>()
  const { mutate: createVisitMutation } = useCreateVisitMutation({
    onSuccess: () => {
      addSnackbarMessage({ type: 'success', text: 'Návštěva byla vytvořena.' })
      setIsNewClient(false)
      resetField('clientId')
      resetField('serviceIds')
    },
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setIsNewClient(false)
    setOpen(false)
  }

  const onSubmit = (data: Visit) => {
    createVisitMutation(data)
    handleClose()
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
          <BasicDateTimePicker fieldPath="date" control={control} />
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
