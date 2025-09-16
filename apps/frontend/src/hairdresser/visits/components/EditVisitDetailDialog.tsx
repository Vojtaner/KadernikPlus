import { Button, Stack, Typography } from '@mui/material'
import FormDialog from '../../../app/components/Dialog'
import BasicDateTimePicker from '../../../app/components/BasicDateTimePicker'
import SelectField from '../../../app/components/SelectField'
import TextField from '../../../app/components/TextField'
import { depositStatusOptions, type VisitDetailFormType } from '../entity'
import { useParams } from 'react-router-dom'
import { useCallback, useState } from 'react'
import Loader from '../../pages/Loader'
import { useForm, useWatch } from 'react-hook-form'
import React from 'react'
import { getMissingStockAllowanceError, getVisitFinishErrors } from './VisitDetailGrid'
import { FormattedMessage } from 'react-intl'
import CloseVisitDialog from './CloseVisitDialog'
import ServicesAutoComplete from '../../service/components/ServicesAutoComplete'
import { useUpdateVisitMutation, useVisitQuery, useVisitStatusMutation } from '../queries'
import RedSwitch from '../../../app/components/Switch/RedSwitch'

const EditVisitDetailDialog = (props: {
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>
}) => {
  const { openButton } = props
  const [open, setOpen] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const { visitId } = useParams()
  const { mutate: updateVisitMutation } = useUpdateVisitMutation(visitId)
  const { data: visit, isLoading, isError } = useVisitQuery(visitId)
  const [isSwitchOn, setIsSwitchOn] = useState(visit?.visitStatus)
  const { mutate: changeVisitStatus } = useVisitStatusMutation()
  const { control, handleSubmit, getValues, setValue } = useForm<VisitDetailFormType>({
    defaultValues: {
      date: visit?.date,
      deposit: visit?.deposit,
      depositStatus: visit?.depositStatus,
      hairdresserId: visit?.userId,
      paidPrice: visit?.paidPrice,
      note: visit?.note,
      visitClosed: visit?.visitStatus,
      hairCutId: visit?.visitServices[0].serviceId,
      visitServiceId: visit?.visitServices[0].id,
    },
  })
  const paidPrice = useWatch({ control, name: 'paidPrice' })
  const deposit = useWatch({ control, name: 'deposit' })
  const depositStatus = useWatch({ control, name: 'depositStatus' })
  const visitClosed = useWatch({ control, name: 'visitClosed' })
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
  }

  const onSubmit = () => {
    const formData = getValues()
    changeVisitStatus({ status: formData.visitClosed, visitId })
    updateVisitMutation(
      { ...formData, visitServiceId: visit.visitServices[0].id },
      {
        onSuccess: () => {
          handleClose()
        },
      }
    )
  }

  const validateVisit = useCallback(() => {
    const visitStatus = getValues('visitClosed')

    if (!visitStatus) {
      const errors = getVisitFinishErrors(visit.client.deposit, { paidPrice, deposit, depositStatus })
      const missingStockAllowanceError = procedures && getMissingStockAllowanceError(procedures)
      const canSkipDialog =
        getVisitFinishErrors(visit.client.deposit, { paidPrice, deposit, depositStatus }).length === 0 &&
        !getMissingStockAllowanceError(procedures)

      if (canSkipDialog) {
        return true
      }

      if (errors.length || missingStockAllowanceError) {
        return false
      }
    } else {
      return true
    }
  }, [getValues, getVisitFinishErrors, getMissingStockAllowanceError, procedures, visit])

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose}>
            <FormattedMessage id="formDialog.close" defaultMessage="Zavřít" />
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
                disabled={visitClosed}
                label="Stav zálohy"
                items={depositStatusOptions}
                control={control}
                keyExtractor={(status) => status.id}
                labelExtractor={(status) => status.name}
                fieldPath="depositStatus"
              />

              <TextField
                fieldPath="deposit"
                disabled={visitClosed}
                label="Výše zálohy"
                type="number"
                fullWidth
                control={control}
                required
              />
            </>
          )}
          {/* funkcionalita na přeobjednávání zatím aus
          <TeamMemberAutoComplete fieldPath="hairdresserId" control={control} /> */}
          <BasicDateTimePicker fieldPath="date" control={control} disabled={visitClosed} />
          <ServicesAutoComplete fieldPath="hairCutId" control={control} disabled={visitClosed} />
          <TextField
            disabled={visitClosed}
            fieldPath="paidPrice"
            label={`${visit.visitStatus ? 'Zaplacená' : 'Požadovaná'} cena`}
            type="number"
            fullWidth
            control={control}
          />
          <TextField
            disabled={visitClosed}
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
              <FormattedMessage id="addVisit.visitClosed" defaultMessage="Uzavřít návštěvu" />
            </Typography>
            <RedSwitch
              checked={!!isSwitchOn}
              onChange={(_, state) => {
                const isFormValid = validateVisit()
                if (isFormValid) {
                  setIsSwitchOn(state)
                  setValue('visitClosed', state)
                } else {
                  setErrorDialogOpen(true)
                }
              }}
            />
            <CloseVisitDialog
              onConfirm={() => {
                setIsSwitchOn(true)
                setValue('visitClosed', true)
              }}
              onClose={() => setErrorDialogOpen(false)}
              openDialog={errorDialogOpen}
              errors={getVisitFinishErrors(visit.client.deposit, { paidPrice, deposit, depositStatus })}
              missingStockAllowanceError={procedures && getMissingStockAllowanceError(procedures)}
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
