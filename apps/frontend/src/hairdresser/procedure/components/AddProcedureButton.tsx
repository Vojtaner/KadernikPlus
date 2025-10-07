import { Button } from '@mui/material'
import { useForm, useFieldArray } from 'react-hook-form'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import TextField from '../../../app/components/TextField'
import { useState, type ReactElement } from 'react'
import FormDialog from '../../../app/components/FormDialog'
import React from 'react'
import type { PostNewProcedure } from '../../../entities/procedure'
import { useParams } from 'react-router-dom'
import { type StockAllowance } from '../../stock/entity'
import { FormattedMessage } from 'react-intl'
import { useStocksQuery } from '../../stock/queries'
import { useDeleteProcedureMutation, useProceduresMutation } from '../queries'
import AddStockAllowanceForm from './AddStockAllowanceForm'
import { getProcedureInvalidation, mapDefaultStockAlowances } from '../entity'
import { useEditableAndReadonlyStockAllowances } from '../store'
import { addPropsToReactElement } from '../../entity'
import { queryClient } from '../../../reactQuery/reactTanstackQuerySetup'

export type AddProcedureStockAllowanceType = (Omit<StockAllowance, 'id' | 'quantity'> & {
  id: string
  quantity: number | null
  stockItemName?: string
  avgUnitPrice?: string
})[]

export type StockAllowanceFormValues = {
  description: string
  stockAllowances: AddProcedureStockAllowanceType
}

export type AddProcedureButtonProps = {
  defaultValues?: {
    stockAllowances: AddProcedureStockAllowanceType
    description: string
  }
  openButton: ReactElement<{ onClick: (e: React.MouseEvent) => void; color: string }>
  procedureId?: string
}

const AddProcedureButton = (props: AddProcedureButtonProps) => {
  const { openButton, defaultValues, procedureId } = props
  const { editableAllowances, readonlyAllowances } = useEditableAndReadonlyStockAllowances(
    defaultValues?.stockAllowances
  )
  const { visitId } = useParams()
  const { data: stocks } = useStocksQuery()
  const [open, setOpen] = useState(false)

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      description: defaultValues?.description ?? '',
      stockAllowances: mapDefaultStockAlowances(editableAllowances),
    },
  })

  const { fields, append, remove, replace } = useFieldArray<StockAllowanceFormValues, 'stockAllowances'>({
    name: 'stockAllowances',
    control,
  })

  const { mutation: deleteProcedure } = useDeleteProcedureMutation({
    onSuccess: () => {
      getProcedureInvalidation(stocks, visitId)
    },
  })

  const { mutation: createNewProcedure } = useProceduresMutation({
    onSuccess: () => {
      getProcedureInvalidation(stocks, visitId)
      reset()
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
  })

  const handleClickOpen = () => {
    if (defaultValues) {
      const stockAllowancesDefault = mapDefaultStockAlowances(editableAllowances)
      replace(stockAllowancesDefault)
      reset({ stockAllowances: stockAllowancesDefault, description: defaultValues.description })
    }

    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      handleSubmit={() =>
        handleSubmit((formData) => {
          createNewProcedure.mutate({
            stockAllowances: [...formData.stockAllowances, ...readonlyAllowances],
            description: formData.description,
            visitId,
            id: procedureId,
          } as unknown as PostNewProcedure)
          handleClose()
          scroll()
        })
      }
      actions={
        <>
          {procedureId && (
            <Button
              onClick={() => deleteProcedure.mutate(procedureId)}
              endIcon={<DeleteOutlineIcon fontSize="small" />}>
              Smazat
            </Button>
          )}
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
          <TextField
            fieldPath="description"
            label="Popis postupu"
            type="text"
            control={control}
            fullWidth
            multiline
            minRows={2}
            maxRows={10}
          />
          <AddStockAllowanceForm
            control={control}
            name="stockAllowances"
            remove={remove}
            fields={fields}
            append={append}
            readonlyAllowances={readonlyAllowances}
          />
        </>
      }
      onOpenButton={addPropsToReactElement(openButton, {
        onClick: (e: React.MouseEvent) => {
          openButton.props.onClick?.(e)
          handleClickOpen()
        },
        color: 'error',
      })}
      title="Přidat postup"
      dialogHelperText="Zde zadejte popis úkonu, časy, komplikace, kompromisy."
    />
  )
}

export default AddProcedureButton
