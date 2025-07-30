import { Button, Stack } from '@mui/material'
import { useState } from 'react'
import FormDialog from '../Dialog'
import TextField from '../TextField'
import { unitList } from '../../reactHookForm/entity'
import SelectField from '../SelectField'
import { useCreateOrUpdateStockItemMutation, useStocksQuery } from '../../queries'
import StockItemsAutoComplete from '../AutoCompletes/StockItemsAutoComplete'
import type { StockItemDefaultValuesType } from '../../../../entities/stock-item'
import React from 'react'
import { useForm } from 'react-hook-form'

type AddEditBuyStockItemButtonProps = {
  defaultValues?: StockItemDefaultValuesType
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>
}

const AddEditBuyStockItemButton = (props: AddEditBuyStockItemButtonProps) => {
  const { defaultValues, openButton } = props
  const [open, setOpen] = useState(false)
  const { control, reset, handleSubmit } = useForm<StockItemDefaultValuesType>({
    defaultValues: {
      ...defaultValues,
    },
  })

  const [isPurchaseStockItem, setIsPurchaseStockItem] = useState(defaultValues ? false : true)
  const { mutate: createOrUpdateStockItemMutation } = useCreateOrUpdateStockItemMutation({
    onSuccess: () => {
      reset()
    },
  })

  const openDialogButton = React.cloneElement(openButton, {
    onClick: (e: React.MouseEvent) => {
      openButton.props.onClick?.(e)
      handleClickOpen()
    },
  })

  const { data: stocks } = useStocksQuery()

  const handleClickOpen = () => {
    if (!defaultValues) {
      reset({
        id: undefined,
        itemName: undefined,
        quantity: undefined,
        price: undefined,
        unit: undefined,
        threshold: undefined,
        stockId: undefined,
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (!stocks) {
    return null
  }

  const onSubmit = (data: StockItemDefaultValuesType) => {
    console.log({ data })
    createOrUpdateStockItemMutation(data)
    handleClose()
  }

  return (
    <FormDialog
      isOpen={open}
      handleSubmit={() => handleSubmit(onSubmit)}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={
        <>
          {!defaultValues && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                size="small"
                fullWidth
                sx={getButtonStyles(!isPurchaseStockItem)}
                onClick={() => {
                  setIsPurchaseStockItem(false)
                }}>
                Nová položka
              </Button>
              <Button
                size="small"
                fullWidth
                sx={getButtonStyles(isPurchaseStockItem)}
                onClick={() => {
                  setIsPurchaseStockItem(true)
                }}>
                Doplnění skladu
              </Button>
            </Stack>
          )}
          {isPurchaseStockItem ? (
            <>
              <StockItemsAutoComplete fieldPath="id" control={control} />
              <TextField fieldPath="quantity" label="Počet" type="number" fullWidth required control={control} />
              <TextField fieldPath="price" label="Cena" type="number" fullWidth control={control} />
            </>
          ) : (
            <>
              <SelectField
                items={stocks.map((stock) => {
                  return { name: stock.stockName, id: stock.id }
                })}
                control={control}
                keyExtractor={(stock) => stock.id}
                labelExtractor={(stock) => stock.name}
                fieldPath="stockId"
              />
              <TextField
                control={control}
                fieldPath="itemName"
                label="Skladová položka"
                type="text"
                fullWidth
                required
              />
              <SelectField
                items={unitList}
                control={control}
                keyExtractor={(unit) => unit.name}
                labelExtractor={(unit) => unit.name}
                fieldPath="unit"
              />
              <TextField fieldPath="quantity" label="Množství" type="number" fullWidth required control={control} />
              <TextField fieldPath="price" label="Cena celkem" type="number" fullWidth control={control} />
              <TextField fieldPath="threshold" label="Minimální množství" type="number" control={control} fullWidth />
            </>
          )}
        </>
      }
      onOpenButton={openDialogButton}
      title="Upravit položku na skladě."
    />
  )
}

export default AddEditBuyStockItemButton

const getButtonStyles = (active: boolean) => ({
  lineHeight: '18px',
  backgroundColor: active ? 'primary.main' : undefined,
  color: active ? 'white' : undefined,
})
