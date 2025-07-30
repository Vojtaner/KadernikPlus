import { Button } from '@mui/material'
import FormDialog from '../Dialog'
import { useState } from 'react'
import { useCreateNewOrUpdateClientMutation } from '../../queries'
import type { ClientCreateData } from '../../../../entities/client'
import React from 'react'
import { useForm } from 'react-hook-form'
import AddNewClientForm from '../AddNewClientForm'
import type { Visit } from '../../../../entities/visit'

type AddOrUpdateClientItemButtonProps = {
  defaultValues?: ClientCreateData
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>
  clientId?: string
}

const AddOrUpdateClientItemButton = (props: AddOrUpdateClientItemButtonProps) => {
  const { defaultValues, openButton, clientId } = props
  const [open, setOpen] = useState(false)
  const { mutate: createNewClientMutation } = useCreateNewOrUpdateClientMutation()
  const { control, reset, handleSubmit } = useForm<Visit>({ defaultValues: { ...defaultValues } })

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
  }

  const onSubmit = (data: ClientCreateData) => {
    createNewClientMutation(clientId ? { ...data, id: clientId } : data)
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
        <>
          <AddNewClientForm control={control} />
        </>
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
