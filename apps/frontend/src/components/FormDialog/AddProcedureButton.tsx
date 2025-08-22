import { Stack, IconButton, Button, Typography, Box, type ButtonProps } from '@mui/material'
import { Grid } from '@mui/material'
import {
  Controller,
  useForm,
  type Control,
  type FieldPath,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  useFieldArray,
  useWatch,
} from 'react-hook-form'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import TextField from '../TextField'
import { useState, type ReactElement } from 'react'
import FormDialog from '../Dialog'
import StockItemsAutoComplete from '../AutoCompletes/StockItemsAutoComplete'
import React from 'react'
import { useDeleteProcedureMutation, useProceduresMutation, useStockItemsQuery, useStocksQuery } from '../../queries'
import type { PostNewProcedure } from '../../entities/procedure'
import { useParams } from 'react-router-dom'
import type { StockAllowance } from '../../entities/stock-item'
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup'
import type { CommonProps } from '@mui/material/OverridableComponent'
import type { AppPaletteColor } from '../../entity'

export type AddProcedureStockAllowanceType = (Omit<StockAllowance, 'id' | 'quantity'> & {
  id: string
  quantity: number
})[]

type AddProcedureButtonProps = {
  defaultValues?: {
    stockAllowances: AddProcedureStockAllowanceType
    description: string
  }
  openButton: ReactElement<{ onClick: (e: React.MouseEvent) => void; color: string }>
  procedureId?: string
}

type StockAllowanceFormValues = {
  description: string
  stockAllowances: AddProcedureStockAllowanceType
}

type AddStockAllowanceFormProps<TForm extends StockAllowanceFormValues> = {
  control: Control<TForm>
  name: FieldPath<TForm>
  append: UseFieldArrayAppend<StockAllowanceFormValues, 'stockAllowances'>
  remove: UseFieldArrayRemove
  fields: AddProcedureStockAllowanceType
}

const AddProcedureButton = (props: AddProcedureButtonProps) => {
  const { visitId } = useParams()
  const { data: stocks } = useStocksQuery()
  const { openButton, defaultValues, procedureId } = props
  const [open, setOpen] = useState(false)
  const scroll = useScrollToTheTop()

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      description: defaultValues?.description ?? '',
      stockAllowances: mapDefaultStockAlowances(defaultValues?.stockAllowances),
    },
  })

  const { fields, append, remove, replace } = useFieldArray<StockAllowanceFormValues, 'stockAllowances'>({
    name: 'stockAllowances',
    control,
  })

  const { mutation: deleteProcedure } = useDeleteProcedureMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockItems'] })
      queryClient.invalidateQueries({ queryKey: ['procedures', visitId] })
      queryClient.invalidateQueries({ queryKey: ['stockItems', stocks && stocks[0].id] })
    },
  })

  const { mutation: createNewProcedure } = useProceduresMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockItems'] })
      queryClient.invalidateQueries({ queryKey: ['procedures', visitId] })
      queryClient.invalidateQueries({ queryKey: ['stockItems', stocks && stocks[0].id] })

      reset()
      setOpen(false)
    },
  })

  const handleClickOpen = () => {
    if (defaultValues) {
      const stockAllowancesDefault = mapDefaultStockAlowances(defaultValues.stockAllowances)
      replace(stockAllowancesDefault)
      reset({ stockAllowances: stockAllowancesDefault, description: defaultValues.description })
    }

    setOpen(true)
  }

  const handleClose = () => {
    scroll()
    setOpen(false)
  }

  const openDialogButton = addPropsToReactElement(openButton, {
    onClick: (e: React.MouseEvent) => {
      openButton.props.onClick?.(e)
      handleClickOpen()
    },
    color: 'error',
  })

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      handleSubmit={() =>
        handleSubmit((formData) => {
          createNewProcedure.mutate({ ...formData, visitId, id: procedureId } as unknown as PostNewProcedure)
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
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
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
          />
        </>
      }
      onOpenButton={openDialogButton}
      title="Přidat postup"
      dialogHelperText="Zde zadejte popis úkonu, časy, komplikace, kompromisy."
    />
  )
}

export default AddProcedureButton

const addPropsToReactElement = (
  element: ReactElement,
  props: ButtonProps & CommonProps & { color: AppPaletteColor }
) => {
  return React.cloneElement(element, { ...props })
}

const AddStockAllowanceForm = (props: AddStockAllowanceFormProps<StockAllowanceFormValues>) => {
  const { control, append, remove, fields } = props
  const { data: stocks } = useStocksQuery()
  const { data: stockItems } = useStockItemsQuery(stocks ? stocks[0].id : undefined)
  const watchedStockAllowanecs = useWatch({ control })

  return (
    <Stack spacing={3}>
      {fields.map((field, index) => {
        const fielArrayStockItem =
          watchedStockAllowanecs.stockAllowances && watchedStockAllowanecs.stockAllowances[index]
        {
          const stockItem =
            fielArrayStockItem &&
            stockItems &&
            stockItems.find((stockItem) => stockItem.id === fielArrayStockItem.stockItemId)
          // const updatedStockQuantity = stockItem && stockItem.quantity - (fielArrayStockItem?.quantity ?? 0)
          const updatedStockQuantity = stockItem && stockItem.quantity
          const stockItemQuantityCritical = updatedStockQuantity && updatedStockQuantity < stockItem.threshold

          return (
            <Stack key={field.id} spacing={0.5}>
              <Grid container spacing={2} alignItems="center">
                <Controller name={`stockAllowances.${index}.id`} control={control} render={() => <></>} />
                <Grid size={7}>
                  <StockItemsAutoComplete fieldPath={`stockAllowances.${index}.stockItemId`} control={control} />
                </Grid>
                <Grid size={3}>
                  <TextField
                    type="number"
                    label={`Množství (${stockItem?.unit ? stockItem?.unit : ''})`}
                    fieldPath={`stockAllowances.${index}.quantity`}
                    control={control}
                  />
                </Grid>
                <Grid size={2}>
                  <IconButton onClick={() => remove(index)} color="error">
                    <DeleteOutlineIcon />
                  </IconButton>
                </Grid>
              </Grid>

              {stockItem ? (
                <Typography color="text.secondary" fontSize="0.8rem" paddingLeft="0.2rem">
                  Aktuálně ve skladu
                  <Box
                    component="span"
                    color={stockItemQuantityCritical ? 'primary.main' : 'success.main'}
                    fontWeight="bold">
                    {` ${updatedStockQuantity} ${stockItem?.unit}`}
                  </Box>
                </Typography>
              ) : null}
            </Stack>
          )
        }
      })}
      <Button onClick={() => append({ stockItemId: '', quantity: 0, id: '' })} variant="outlined">
        Přidat materiál
      </Button>
    </Stack>
  )
}

const mapDefaultStockAlowances = (
  defaultStockAllowances?: AddProcedureStockAllowanceType
): { stockItemId: string; quantity: number; id: string }[] => {
  if (!defaultStockAllowances) {
    return []
  }
  return defaultStockAllowances.map((stockAllowance) => ({
    stockItemId: stockAllowance.stockItemId,
    quantity: Number(stockAllowance.quantity),
    id: stockAllowance.id ?? '',
  }))
}

export const useScrollToTheTop = () => {
  const scroll = () =>
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

  return scroll
}
