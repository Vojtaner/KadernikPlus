import { Button, Stack, Typography } from '@mui/material'
import FormDialog from '../Dialog'
import BasicDateTimePicker from '../DateTimePicker'
import { useUpdateVisitMutation, useVisitQuery, useVisitStatusMutation } from '../../queries'
import SelectField from '../SelectField'
import TextField from '../TextField'
import { depositStatusOptions, type VisitDetailFormType } from '../../entities/visit'
import TeamMemberAutoComplete from '../AutoCompletes/TeamMemberAutoComplete'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Loader from '../../pages/Loader'
import { useForm, useWatch } from 'react-hook-form'
import React from 'react'
import { useScrollToTheTop } from './AddProcedureButton'
import RedSwitch from '../RedSwitch'
import { isVisitFinished } from '../../pages/VisitDetailGrid'
import ServicesAutoComplete from '../AutoCompletes/ServicesAutoComplete'
import { FormattedMessage } from 'react-intl'

const EditVisitDetailDialog = (props: {
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>
}) => {
  const { openButton } = props
  const [open, setOpen] = useState(false)
  const { visitId } = useParams()
  const { mutate: updateVisitMutation } = useUpdateVisitMutation(visitId)
  const { data: visit, isLoading, isError } = useVisitQuery(visitId)
  const scroll = useScrollToTheTop()
  const { mutate: changeVisitStatus } = useVisitStatusMutation()
  const { control, handleSubmit } = useForm<VisitDetailFormType>({
    defaultValues: {
      date: visit?.date,
      deposit: visit?.deposit,
      depositStatus: visit?.depositStatus,
      hairdresserId: visit?.userId,
      paidPrice: visit?.paidPrice,
      note: visit?.note,
      hairCutId: visit?.visitServices[0].serviceId,
      visitServiceId: visit?.visitServices[0].id,
    },
  })

  const paidPrice = useWatch({ control, name: 'paidPrice' })
  const deposit = useWatch({ control, name: 'deposit' })
  const depositStatus = useWatch({ control, name: 'depositStatus' })

  if (isLoading) {
    return <Loader />
  }

  if (!visit || isError) {
    return <Typography>Detail návštěvy nebyl nalezen.</Typography>
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const openDialogButton = React.cloneElement(openButton, {
    onClick: (e: React.MouseEvent) => {
      openButton.props.onClick?.(e)
      handleClickOpen()
    },
  })

  const handleClose = () => {
    setOpen(false)
    scroll()
  }

  const onSubmit = (data: VisitDetailFormType) => {
    updateVisitMutation({ ...data, visitServiceId: visit.visitServices[0].id })
    handleClose()
    scroll()
  }

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
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
          {visit.client.deposit && (
            <>
              <SelectField
                label="Stav zálohy"
                items={depositStatusOptions}
                control={control}
                keyExtractor={(status) => status.id}
                labelExtractor={(status) => status.name}
                fieldPath="depositStatus"
              />
              <TextField fieldPath="deposit" label="Výše zálohy" type="number" fullWidth control={control} required />
            </>
          )}
          <TeamMemberAutoComplete fieldPath="hairdresserId" control={control} />
          <BasicDateTimePicker fieldPath="date" control={control} />
          <ServicesAutoComplete fieldPath="hairCutId" control={control} />
          <TextField
            fieldPath="paidPrice"
            label={`${visit.visitStatus ? 'Zaplacená' : 'Požadovaná'} cena`}
            type="number"
            fullWidth
            control={control}
            required
          />
          <TextField
            fieldPath="note"
            label="Informace k návštěvě"
            type="text"
            fullWidth
            multiline
            control={control}
            minRows={2}
            maxRows={5}
          />

          <Stack
            direction="row"
            alignItems="center"
            bgcolor="#dddddd"
            paddingX="1rem"
            borderRadius="10px"
            boxShadow="0px 1px 7px 0px rgba(0,0,0,0.12)">
            <Typography fontWeight={600} color="secondary.main">
              Uzavřít návštěvu
            </Typography>
            <RedSwitch
              disabled={!isVisitFinished(visit.client.deposit, { paidPrice, deposit, depositStatus })}
              checked={visit.visitStatus}
              onSubmitEndpoint={(checked) => {
                changeVisitStatus({ status: checked, visitId })
              }}
            />
          </Stack>
          <Typography color="primary.main">
            Uzavřením uvidíte návštěvu v tržbách. Uzavřít lze pokud máte zadanou tržbu a případně zálohu.
          </Typography>
        </>
      }
      handleSubmit={() => handleSubmit(onSubmit)}
      onOpenButton={openDialogButton}
      title="Detail návštěvy"
    />
  )
}

export default EditVisitDetailDialog
