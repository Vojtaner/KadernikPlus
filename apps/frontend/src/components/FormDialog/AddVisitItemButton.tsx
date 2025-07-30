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
import AddNewClientForm from '../AddNewClientForm'

export const AddVisitItemButton = () => {
  const [open, setOpen] = useState(false)
  const [isNewClient, setIsNewClient] = useState(false)
  const { control, resetField, handleSubmit } = useForm<Visit>()
  const { mutate: createVisitMutation } = useCreateVisitMutation({
    onSuccess: () => {
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
          {isNewClient && <AddNewClientForm control={control} />}
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
