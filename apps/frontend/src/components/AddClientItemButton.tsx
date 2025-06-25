import { Button } from '@mui/material'
import FormDialog from './Dialog'
import MenuIconButton from './MenuIconButton'
import { useState } from 'react'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import TextField from './TextField'

const AddClientItemButton = () => {
  const [open, setOpen] = useState(false)

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
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={
        <>
          <TextField fieldPath="newClientFirstName" label="Jméno" type="text" fullWidth />
          <TextField fieldPath="newClientSecondName" label="Přijmení" type="text" fullWidth />
          <TextField fieldPath="newClientPhone" label="Telefon" type="number" fullWidth />
        </>
      }
      onOpenButton={
        <MenuIconButton icon={<PersonAddAlt1OutlinedIcon />} onClick={handleClickOpen} title="Přidat klienta" />
      }
      title="Přidat klienta"
    />
  )
}

export default AddClientItemButton
