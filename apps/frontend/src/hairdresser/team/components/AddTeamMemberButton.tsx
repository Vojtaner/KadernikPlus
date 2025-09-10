import { Button } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import FormDialog from '../../../app/components/Dialog'
import TextField from '../../../app/components/TextField'
import { useAddTeamMemberMutation } from '../queries'
import { useAppNavigate } from '../../../hooks'
import { queryClient } from '../../../reactQuery/reactTanstackQuerySetup'
import { useParams } from 'react-router-dom'

type TeamMemberForm = {
  email: string
  consentId: string
}

const AddTeamMemberButton = () => {
  const [open, setOpen] = useState(false)
  const { teamId } = useParams()
  const { control, handleSubmit } = useForm<TeamMemberForm>()
  const { mutate: addTeamMemberMutation } = useAddTeamMemberMutation()
  const navigate = useAppNavigate()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data: TeamMemberForm) => {
    addTeamMemberMutation({ email: data.email, consentId: data.consentId })
    handleClose()
    navigate(-1)
    queryClient.invalidateQueries({ queryKey: ['teamMember'] })
    queryClient.invalidateQueries({ queryKey: ['teamMembers', teamId] })
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
              minLength: { message: 'Majitel týmu uvidí ID na svém profilu', value: 4 },
              maxLength: { message: 'Majitel týmu uvidí ID na svém profilu', value: 4 },
            }}
          />
        </>
      }
      onOpenButton={<Button onClick={handleClickOpen}>Přidat se do cizího týmu</Button>}
      title="Zadejte email"
      dialogHelperText="Takto se stanete součástí jiného týmu. Smaže se Vám Váš sklad a budete sklad sdílet s majitelem týmu. Veškeré spotřeby i náklady u návštěv Vám zůstanou."
    />
  )
}

export default AddTeamMemberButton
