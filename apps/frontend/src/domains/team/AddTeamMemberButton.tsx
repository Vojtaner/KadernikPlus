import { Button } from '@mui/material'
import { useState } from 'react'
import FormDialog from '../../app/components/Dialog'
import TextField from '../../app/components/TextField'
import { useAddTeamMemberMutation } from '../../queries'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useScrollToTheTop } from '../procedure/AddProcedureButton'

type TeamMemberForm = {
  email: string
  consentId: string
}

const AddTeamMemberButton = () => {
  const [open, setOpen] = useState(false)
  const { control, handleSubmit } = useForm<TeamMemberForm>()
  const { mutate: addTeamMemberMutation } = useAddTeamMemberMutation()
  const scroll = useScrollToTheTop()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    scroll()
  }

  const onSubmit = (data: TeamMemberForm) => {
    addTeamMemberMutation({ email: data.email, consentId: data.consentId })
    handleClose()
    scroll()
  }

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      handleSubmit={() => handleSubmit(onSubmit)}
      actions={
        <>
          <Button onClick={handleClose}>
            <FormattedMessage id="formDialog.close" defaultMessage={'Zavřít'} />
          </Button>
          <Button type="submit">
            <FormattedMessage id="formDialog.save" defaultMessage={'Uložit'} />
          </Button>
        </>
      }
      formFields={
        <>
          <TextField fieldPath="email" label="E-mail" type="email" control={control} required fullWidth />
          <TextField
            fieldPath="consentId"
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
