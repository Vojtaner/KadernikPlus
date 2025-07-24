import { Button } from '@mui/material'
import FormDialog from '../Dialog'
import { useState } from 'react'
import TextField from '../TextField'
import { useCreateNewOrUpdateClientMutation } from '../../queries'
import { useAppFormContext } from '../../reactHookForm/store'
import type { ClientCreateData } from '../../../../entities/client'
import React from 'react'

type AddOrUpdateClientItemButtonProps = {
  defaultValues?: { firstName: string; lastName: string; phone: string | null; note?: string | null }
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>
  clientId?: string
}

const AddOrUpdateClientItemButton = (props: AddOrUpdateClientItemButtonProps) => {
  const { defaultValues, openButton, clientId } = props
  const [open, setOpen] = useState(false)
  const { mutate: createNewClientMutation } = useCreateNewOrUpdateClientMutation()
  const { control } = useAppFormContext()

  const handleClickOpen = () => {
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
      onSubmitEndpoint={(clientData) =>
        createNewClientMutation(
          (clientId ? { ...clientData, id: clientId } : clientData) as unknown as ClientCreateData
        )
      }
      formFields={
        <>
          <TextField
            fieldPath="firstName"
            control={control}
            label="Jméno"
            defaultValue={defaultValues?.firstName}
            type="text"
            fullWidth
            rules={firstNameValidationrule}
          />
          <TextField
            fieldPath="lastName"
            control={control}
            label="Přijmení"
            defaultValue={defaultValues?.lastName}
            type="text"
            fullWidth
            rules={firstNameValidationrule}
          />
          <TextField
            fieldPath="phone"
            control={control}
            defaultValue={defaultValues?.phone}
            label="Telefon"
            type="tel"
            fullWidth
            rules={phoneValidationRule}
          />
          <TextField
            fieldPath="note"
            control={control}
            label="Poznámka"
            defaultValue={defaultValues?.note}
            type="text"
            multiline
            minRows={2}
            maxRows={10}
            fullWidth
          />
        </>
      }
      onOpenButton={openDialogButton}
      title="Přidat klienta"
    />
  )
}

export default AddOrUpdateClientItemButton

const phoneValidationRule = {
  pattern: {
    value: /^\+?[0-9]{7,15}$/,
    message: 'Zadejte platné telefonní číslo.',
  },
}
const firstNameValidationrule = {
  minLength: {
    value: 3,
    message: 'Jméno musí mít alespoň 3 znaky.',
  },
}
