import { Button } from '@mui/material'
import { useState } from 'react'
import FormDialog from './Dialog'
import TextField from './TextField'
import { useAppFormContext } from '../reactHookForm/store'
import { useAddTeamMemberMutation } from '../queries'

const AddTeamMemberButton = () => {
  const [open, setOpen] = useState(false)
  const { control } = useAppFormContext()
  const { mutate: addTeamMemberMutation } = useAddTeamMemberMutation()

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
      onSubmitEndpoint={(appFormState) => {
        addTeamMemberMutation({ email: appFormState.teamMemberEmail, consentId: appFormState.teamMemberConsentId })
      }}
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={
        <>
          <TextField fieldPath="teamMemberEmail" label="E-mail" type="email" control={control} required fullWidth />
          <TextField
            fieldPath="teamMemberConsentId"
            label="Souhlasné ID"
            type="text"
            control={control}
            required
            fullWidth
            rules={{
              minLength: { message: 'Zvaný uživatel uvidí ID na svém profilu', value: 4 },
              maxLength: { message: 'Zvaný uživatel uvidí ID na svém profilu', value: 4 },
            }}
          />
        </>
      }
      onOpenButton={<Button onClick={handleClickOpen}>+ Přidat člena</Button>}
      title="Zadejte email"
      dialogHelperText="Kolega/kolegyně musí mít aktivní účet."
    />
  )
}

export default AddTeamMemberButton
