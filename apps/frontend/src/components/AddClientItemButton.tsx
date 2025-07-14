import { Button } from '@mui/material'
import FormDialog from './Dialog'
import MenuIconButton from './MenuIconButton'
import { useState } from 'react'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import TextField from './TextField'
import { useCreateNewClientMutation } from '../queries'
import { useAppFormContext } from '../reactHookForm/store'

const AddClientItemButton = () => {
  const [open, setOpen] = useState(false)
  const { mutate: createNewClientMutation } = useCreateNewClientMutation()
  const { control } = useAppFormContext()

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
      onSubmitEndpoint={(clientData) => createNewClientMutation(clientData)}
      formFields={
        <>
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
        </>
      }
      onOpenButton={
        <MenuIconButton
          icon={<PersonAddAlt1OutlinedIcon fontSize="large" />}
          onClick={handleClickOpen}
          title="Přidat klienta"
        />
      }
      title="Přidat klienta"
    />
  )
}

export default AddClientItemButton

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
