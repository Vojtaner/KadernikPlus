import { Button, Stack, Typography } from '@mui/material'
import FormDialog from '../../../app/components/Dialog'
import BasicDateTimePicker from '../../../app/components/BasicDateTimePicker'
import { useUpdateVisitMutation, useVisitQuery, useVisitStatusMutation } from '../../../queries'
import SelectField from '../../../app/components/SelectField'
import TextField from '../../../app/components/TextField'
import { depositStatusOptions, type VisitDetailFormType } from '../entity'
import TeamMemberAutoComplete from '../../../components/AutoCompletes/TeamMemberAutoComplete'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Loader from '../../../pages/Loader'
import { useForm, useWatch } from 'react-hook-form'
import React from 'react'
import { useScrollToTheTop } from '../../../components/FormDialogs/AddProcedureButton'
import RedSwitch from '../../../app/components/Switch/RedSwitch'
import { getMissingStockAllowanceError, getVisitFinishErrors } from '../VisitDetailGrid'
import ServicesAutoComplete from '../../../components/AutoCompletes/ServicesAutoComplete'
import { FormattedMessage } from 'react-intl'
import CloseVisitDialog from './CloseVisitDialog'

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
  const procedures = visit?.procedures

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

  // clientDeposit: boolean,
  // watchFormVisitData: {
  //   paidPrice: number | undefined
  //   deposit: number | undefined
  //   depositStatus: 'NEZAPLACENO' | 'ZAPLACENO' | null | undefined
  //   procedures: undefined | Procedure[]
  // }

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

            <CloseVisitDialog
              checked={visit.visitStatus}
              errors={getVisitFinishErrors(visit.client.deposit, { paidPrice, deposit, depositStatus })}
              missingStockAllowanceError={procedures && getMissingStockAllowanceError(procedures)}
              canSkipDialog={
                getVisitFinishErrors(visit.client.deposit, { paidPrice, deposit, depositStatus }).length === 0 &&
                !getMissingStockAllowanceError(procedures)
              }
              onConfirm={() => changeVisitStatus({ status: !visit.visitStatus, visitId })}
              openButton={<RedSwitch checked={visit.visitStatus} />}
            />
          </Stack>
        </>
      }
      handleSubmit={() => handleSubmit(onSubmit)}
      onOpenButton={openDialogButton}
      title="Detail návštěvy"
    />
  )
}

export default EditVisitDetailDialog
