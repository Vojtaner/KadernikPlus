import { Button, Typography } from '@mui/material'
import FormDialog from '../Dialog'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import BasicDateTimePicker from '../DateTimePicker'
import { useAppFormContext } from '../../reactHookForm/store'
import { useUpdateVisitMutation, useVisitQuery } from '../../queries'
import BoxIcon from '../BoxIcon'
import SelectField from '../SelectField'
import TextField from '../TextField'
import { depositStatusOptions } from '../../../../entities/visit'
import TeamMemberAutoComplete from '../AutoCompletes/TeamMemberAutoComplete'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Loader from '../../pages/Loader'

const EditVisitDetailDialog = () => {
  const [open, setOpen] = useState(false)
  const { control } = useAppFormContext()
  const { visitId } = useParams()
  const { mutate: updateVisitMutation } = useUpdateVisitMutation(visitId)
  const { data: visit, isLoading, isError } = useVisitQuery(visitId)

  if (isLoading) {
    return <Loader />
  }

  if (!visit || isError) {
    return <Typography>Detail návštěvy nebyl nalezen.</Typography>
  }

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
          <SelectField
            items={depositStatusOptions}
            control={control}
            keyExtractor={(status) => status.id}
            labelExtractor={(status) => status.name}
            fieldPath="depositStatus"
            defaultValue={visit.depositStatus}
          />
          <TeamMemberAutoComplete fieldPath="hairdresserId" control={control} defaultValue={visit.userId} />
          <BasicDateTimePicker fieldPath="date" control={control} defaultValue={visit.date} />
          <TextField
            fieldPath="deposit"
            label="Zaplacená záloha"
            type="number"
            fullWidth
            required
            defaultValue={visit.deposit}
          />
          <TextField
            fieldPath="paidPrice"
            label="Cena"
            type="number"
            fullWidth
            required
            defaultValue={visit.paidPrice}
          />
        </>
      }
      onSubmitEndpoint={(visitData) => {
        updateVisitMutation(visitData)
      }}
      onOpenButton={
        <BoxIcon
          size={'medium'}
          icon={<EditOutlinedIcon fontSize="small" color="secondary" />}
          boxColor="secondary.light"
          onClick={handleClickOpen}
        />
      }
      title="Detail návštěvy"
    />
  )
}

export default EditVisitDetailDialog
