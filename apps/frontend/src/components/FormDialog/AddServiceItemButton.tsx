import { Button } from '@mui/material'
import { useState } from 'react'
import FormDialog from '../Dialog'
import MenuIconButton from '../MenuIconButton'
import TextField from '../TextField'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import { useCreateServiceMutation } from '../../queries'
import { useAppFormContext } from '../../reactHookForm/store'

const AddServiceItemButton = () => {
  const [open, setOpen] = useState(false)
  const { control } = useAppFormContext()
  const { mutate: createServicemMutation } = useCreateServiceMutation()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      onSubmitEndpoint={(serviceData) => createServicemMutation(serviceData)}
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
