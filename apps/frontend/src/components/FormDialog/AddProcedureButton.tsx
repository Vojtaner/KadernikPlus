import { Stack, IconButton, Button, Typography, Box } from '@mui/material'
import { Grid } from '@mui/material'
import {
  Controller,
  useForm,
  useFieldArray,
  type Control,
  type FieldPath,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
} from 'react-hook-form'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import TextField from '../TextField'
import { useEffect, useState, type ReactElement } from 'react'
import FormDialog from '../Dialog'
import StockItemsAutoComplete from '../AutoCompletes/StockItemsAutoComplete'
import React from 'react'
import { useProceduresMutation } from '../../queries'
import type { PostNewProcedure } from '../../../../entities/procedure'
import { useParams } from 'react-router-dom'
import type { StockAllowance } from '../../../../entities/stock-item'

export type AddProcedureStockAllowanceType = (Omit<StockAllowance, 'id'> & {
  currentQuantity: number
  unit: string
  id: string
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
  const { openButton, defaultValues, procedureId } = props
  const [open, setOpen] = useState(false)
  const { fields, append, remove } = useFieldArray<StockAllowanceFormValues>({
    name: 'stockAllowances',
  })

  const { mutation: createNewProcedure } = useProceduresMutation({
    onSuccess: () => {
      remove()
      reset()
      setOpen(false)
    },
  })
  const defaultStockAlowances = defaultValues
    ? mapDefaultStockAlowances(defaultValues.stockAllowances)
    : [{ stockItemId: '', quantity: 0, id: '', currentQuantity: 0, unit: '' }]

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      description: defaultValues?.description ?? '',
      stockAllowances: defaultStockAlowances,
    },
  })

  const handleClickOpen = () => {
    remove()
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const openDialogButton = React.cloneElement(openButton, {
    onClick: (e: React.MouseEvent) => {
      openButton.props.onClick?.(e)
      handleClickOpen()
    },
    color: 'error',
  })

  useEffect(() => {
    if (open && fields.length === 0 && defaultStockAlowances.length > 0) {
      defaultStockAlowances.forEach((item) => {
        append(item)
      })
    }
  }, [open])

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      handleSubmit={() =>
        handleSubmit((formData) => {
          createNewProcedure.mutate({ ...formData, visitId, id: procedureId } as unknown as PostNewProcedure)
        })
      }
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={
        <>
          <TextField
            fieldPath="description"
            label="Poznámka"
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

const AddStockAllowanceForm = (props: AddStockAllowanceFormProps<StockAllowanceFormValues>) => {
  const { control, append, remove, fields } = props

  return (
    <Stack spacing={3}>
      {fields.map((field, index) => {
        {
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
                    label="Počet"
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

              <Typography color="text.secondary" fontSize="0.8rem" paddingLeft="0.2rem">
                Aktuálně ve skladu{' '}
                <Box component="span" color="primary.main" fontWeight="bold">
                  {`${field.currentQuantity} ${field.unit}`}
                </Box>
              </Typography>
            </Stack>
          )
        }
      })}
      <Button
        onClick={() => append({ stockItemId: '', quantity: 0, unit: '', currentQuantity: 0, id: '' })}
        variant="outlined">
        Přidat položku
      </Button>
    </Stack>
  )
}

const mapDefaultStockAlowances = (
  defaultStockAllowances: AddProcedureStockAllowanceType
): { stockItemId: string; currentQuantity: number; unit: string; quantity: number; id: string }[] => {
  return defaultStockAllowances.map((stockAllowance) => ({
    stockItemId: stockAllowance.stockItemId,
    quantity: Number(stockAllowance.quantity),
    id: stockAllowance.id ?? '',
    currentQuantity: Number(stockAllowance.stockItem?.quantity),
    unit: stockAllowance.stockItem?.unit ?? '',
  }))
}
