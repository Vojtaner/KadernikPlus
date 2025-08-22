import { Button, Stack } from '@mui/material'
import FormDialog from '../Dialog'
import { useState } from 'react'
import { useCreateNewOrUpdateClientMutation } from '../../queries'
import type { ClientOrUpdateCreateData } from '../../entities/client'
import React from 'react'
import { useForm } from 'react-hook-form'
import TextField from '../TextField'
import { useScrollToTheTop } from './AddProcedureButton'

type AddOrUpdateClientItemButtonProps = {
  defaultValues?: ClientOrUpdateCreateData
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>
  clientId?: string
}

const AddOrUpdateClientItemButton = (props: AddOrUpdateClientItemButtonProps) => {
  const { defaultValues, openButton, clientId } = props
  const [open, setOpen] = useState(false)
  const scroll = useScrollToTheTop()

  const { mutate: createNewClientMutation } = useCreateNewOrUpdateClientMutation()
  const { control, reset, handleSubmit } = useForm<ClientOrUpdateCreateData>({ defaultValues: { ...defaultValues } })

  const handleClickOpen = () => {
    if (!defaultValues) {
      reset({ firstName: undefined, lastName: undefined, note: undefined, phone: undefined })
    }

    setOpen(true)
  }

  const openDialogButton = React.cloneElement(openButton, {
    onClick: (e: React.MouseEvent) => {
      openButton.props.onClick?.(e)
      handleClickOpen()
    },
  })

  const handleClose = () => {
    setOpen(false)
    scroll()
  }

  const onSubmit = (data: ClientOrUpdateCreateData) => {
    createNewClientMutation(clientId ? { ...data, id: clientId } : data)
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
      handleSubmit={() => handleSubmit(onSubmit)}
      formFields={
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
      }
      onOpenButton={openDialogButton}
      title="Přidat klienta"
    />
  )
}

export default AddOrUpdateClientItemButton

export const phoneValidationRule = {
  pattern: {
    value: /^\+?[0-9]{7,15}$/,
    message: 'Zadejte platné telefonní číslo.',
  },
}
export const firstNameValidationrule = {
  minLength: {
    value: 3,
    message: 'Jméno musí mít alespoň 3 znaky.',
  },
}
