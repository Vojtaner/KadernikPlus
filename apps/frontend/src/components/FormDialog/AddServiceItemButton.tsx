import { Button } from '@mui/material'
import { useState } from 'react'
import FormDialog from '../Dialog'
import TextField from '../TextField'
import { useCreateNewOrUpdateServiceMutation } from '../../queries'
import { useForm } from 'react-hook-form'
import type { ServiceCreateOrUpdateData } from '../../entities/service'
import React from 'react'

type AddServiceItemButtonProps = {
  defaultValues?: Partial<ServiceCreateOrUpdateData>
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>
}

const AddServiceItemButton = (props: AddServiceItemButtonProps) => {
  const { openButton, defaultValues } = props
  const [open, setOpen] = useState(false)
  const { control, handleSubmit, reset } = useForm<ServiceCreateOrUpdateData>({ defaultValues })
  const { mutate: createServicemMutation } = useCreateNewOrUpdateServiceMutation()

  const openDialogButton = React.cloneElement(openButton, {
    onClick: (e: React.MouseEvent) => {
      openButton.props.onClick?.(e)
      handleClickOpen()
    },
  })

  const handleClickOpen = () => {
    if (!defaultValues) {
      reset({ serviceName: undefined, basePrice: undefined })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data: ServiceCreateOrUpdateData) => {
    createServicemMutation(data)
    handleClose()
  }

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      handleSubmit={() => handleSubmit(onSubmit)}
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={
        <>
          <TextField control={control} fieldPath="serviceName" label="Název služby" type="text" fullWidth required />
          <TextField control={control} fieldPath="basePrice" label="Cena za službu" type="number" fullWidth required />
        </>
      }
      onOpenButton={openDialogButton}
      title="Přidat službu"
      dialogHelperText="Zde přidáte službu do ceníku."
    />
  )
}

export default AddServiceItemButton
