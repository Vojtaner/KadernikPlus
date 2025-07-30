import { Button } from '@mui/material'
import { useState } from 'react'
import FormDialog from '../Dialog'
import MenuIconButton from '../MenuIconButton'
import TextField from '../TextField'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import { useCreateServiceMutation } from '../../queries'
import { useForm } from 'react-hook-form'
import type { ServiceCreateData } from '../../../../entities/service'

const AddServiceItemButton = () => {
  const [open, setOpen] = useState(false)
  const { control, handleSubmit } = useForm<ServiceCreateData>()
  const { mutate: createServicemMutation } = useCreateServiceMutation()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data: ServiceCreateData) => {
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
          <TextField control={control} fieldPath="basePrice" label="Cena za službu" type="number" fullWidth required />
          <TextField control={control} fieldPath="serviceName" label="Název služby" type="text" fullWidth required />
        </>
      }
      onOpenButton={
        <MenuIconButton icon={<ContentCutIcon fontSize="large" />} onClick={handleClickOpen} title="Přidat službu" />
      }
      title="Přidat službu"
      dialogHelperText="Zde přidáte službu do ceníku."
    />
  )
}

export default AddServiceItemButton
