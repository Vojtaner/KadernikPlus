import { Stack, Grid, IconButton, Button } from '@mui/material'
import { Controller, useFieldArray } from 'react-hook-form'
import { useAppFormContext } from '../../reactHookForm/store'
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

type AddProcedureButtonProps = {
  defaultValues?: {
    stockAllowances: StockAllowance[]
    description: string
  }
  openButton: ReactElement<{ onClick: (e: React.MouseEvent) => void }>
  procedureId?: string
}

const AddProcedureButton = (props: AddProcedureButtonProps) => {
  const { visitId } = useParams()
  const { openButton, defaultValues, procedureId } = props
  const [open, setOpen] = useState(false)
  const { control, resetField } = useAppFormContext()

  const mappedDefaultStockAlowances = defaultValues?.stockAllowances
    ? defaultValues.stockAllowances.map((stockAllowance) => ({
        stockItemId: stockAllowance.stockItemId,
        quantity: Number(stockAllowance.quantity),
        stockAllowanceId: stockAllowance.id,
      }))
    : [{ stockItemId: '', quantity: 0, stockAllowanceId: '' }]

  const { mutation: createNewProcedure } = useProceduresMutation({
    onSuccess: () => {
      remove()
      resetField('description')
      setOpen(false)
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: 'stockAllowances',
  })

  const handleClickOpen = () => {
    remove()
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

  useEffect(() => {
    if (open && fields.length === 0 && mappedDefaultStockAlowances.length > 0) {
      mappedDefaultStockAlowances.forEach((item) => {
        append(item)
      })
    }
  }, [open])

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      onSubmitEndpoint={(formData) => {
        console.log(formData)
        createNewProcedure.mutate({ ...formData, visitId, id: procedureId } as unknown as PostNewProcedure)
      }}
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
            defaultValue={defaultValues?.description}
            control={control}
            fullWidth
            multiline
            minRows={2}
            maxRows={10}
          />

          <Stack spacing={2}>
            {fields.map((field, index) => {
              console.log({ field })
              return (
                <Grid container spacing={2} key={field.id} alignItems="center">
                  <Controller
                    name={`stockAllowances.${index}.stockAllowanceId`}
                    control={control}
                    defaultValue={''}
                    render={() => <></>}
                  />
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
              )
            })}
            <Button onClick={() => append({ stockItemId: '', quantity: 0 })} variant="outlined">
              Přidat položku
            </Button>
          </Stack>
        </>
      }
      onOpenButton={openDialogButton}
      title="Přidat postup"
      dialogHelperText="Zde zadejte popis úkonu, časy, komplikace, kompromisy."
    />
  )
}

export default AddProcedureButton
