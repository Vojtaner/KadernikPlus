import { Button, Typography } from '@mui/material'
import FormDialog from '../Dialog'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import BasicDateTimePicker from '../DateTimePicker'
import { useUpdateVisitMutation, useVisitQuery } from '../../queries'
import BoxIcon from '../BoxIcon'
import SelectField from '../SelectField'
import TextField from '../TextField'
import { depositStatusOptions, type VisitDetailFormType } from '../../../../entities/visit'
import TeamMemberAutoComplete from '../AutoCompletes/TeamMemberAutoComplete'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Loader from '../../pages/Loader'
import { useForm } from 'react-hook-form'

const EditVisitDetailDialog = () => {
  const [open, setOpen] = useState(false)
  const { visitId } = useParams()
  const { mutate: updateVisitMutation } = useUpdateVisitMutation(visitId)
  const { data: visit, isLoading, isError } = useVisitQuery(visitId)
  const { control, handleSubmit } = useForm<VisitDetailFormType>({
    defaultValues: {
      date: visit?.date,
      deposit: visit?.deposit,
      depositStatus: visit?.depositStatus,
      hairdresserId: visit?.userId,
      paidPrice: visit?.paidPrice,
      note: visit?.note,
    },
  })

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

  const onSubmit = (data: VisitDetailFormType) => {
    updateVisitMutation(data)
    handleClose()
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
          />
          <TeamMemberAutoComplete fieldPath="hairdresserId" control={control} />
          <BasicDateTimePicker fieldPath="date" control={control} />
          <TextField fieldPath="deposit" label="Výše zálohy" type="number" fullWidth control={control} required />
          <TextField fieldPath="paidPrice" label="Cena" type="number" fullWidth control={control} required />
          <TextField
            fieldPath="note"
            label="Poznámka"
            type="text"
            fullWidth
            multiline
            control={control}
            minRows={2}
            maxRows={5}
            required
          />
        </>
      }
      handleSubmit={() => handleSubmit(onSubmit)}
      onOpenButton={
        <BoxIcon
          size="medium"
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
