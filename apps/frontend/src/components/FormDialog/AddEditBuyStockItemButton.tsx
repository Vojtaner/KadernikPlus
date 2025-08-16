import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import FormDialog from '../Dialog'
import TextField from '../TextField'
import { unitList } from '../../reactHookForm/entity'
import SelectField from '../SelectField'
import { useCreateOrUpdateStockItemMutation, useStocksQuery } from '../../queries'
import StockItemsAutoComplete from '../AutoCompletes/StockItemsAutoComplete'
import type { StockItemDefaultValuesType } from '../../entities/stock-item'
import React from 'react'
import { useForm, useWatch } from 'react-hook-form'

type AddEditBuyStockItemButtonProps = {
  defaultValues?: Partial<StockItemDefaultValuesType>
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>
  formUsage: 'purchase' | 'purchaseAndNewStockItem' | 'stockItem'
}

const AddEditBuyStockItemButton = (props: AddEditBuyStockItemButtonProps) => {
  const { defaultValues, openButton, formUsage } = props
  const [open, setOpen] = useState(false)
  const isOnlyShoppingForm = formUsage === 'purchase'
  const isPurchaseAndNewStockItemForm = formUsage === 'purchaseAndNewStockItem'
  const isNewStockItemForm = formUsage === 'stockItem'
  const { control, reset, handleSubmit, getValues } = useForm<StockItemDefaultValuesType>({
    defaultValues: {
      ...defaultValues,
    },
  })

  const price = useWatch({ control, name: 'price' })
  const unit = useWatch({ control, name: 'unit' })
  const quantity = useWatch({ control, name: 'quantity' })

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
        packageCount: undefined,
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
    createOrUpdateStockItemMutation({ ...data, stockId: stocks[0].id })
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
          {isPurchaseAndNewStockItemForm && (
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
                Nákup položky
              </Button>
            </Stack>
          )}
          {isPurchaseStockItem || isOnlyShoppingForm ? (
            <>
              <StockItemsAutoComplete fieldPath="id" control={control} />
              <Stack direction="row" spacing={1}>
                <TextField fieldPath="packageCount" label="Počet balení" type="number" required control={control} />
                <TextField
                  fieldPath="quantity"
                  label={`Množství v jednom balení v ${unit}`}
                  type="number"
                  fullWidth
                  required
                  control={control}
                />
              </Stack>
              <TextField
                fieldPath="price"
                label="Cena za všechna balení v Kč"
                type="number"
                fullWidth
                control={control}
              />
            </>
          ) : (
            (isPurchaseAndNewStockItemForm || isNewStockItemForm) && (
              <>
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
                  label="Vyberte jednotku materiálu (bude vždy stejná)"
                  control={control}
                  keyExtractor={(unit) => unit.name}
                  labelExtractor={(unit) => unit.name}
                  fieldPath="unit"
                />
                <Stack direction="row" spacing={1}>
                  <TextField fieldPath="packageCount" label="Počet balení" type="number" required control={control} />
                  <TextField
                    fieldPath="quantity"
                    label={`Množství v jednom balení v ${unit}`}
                    type="number"
                    fullWidth
                    required
                    control={control}
                  />
                </Stack>
                <TextField
                  fieldPath="price"
                  label="Cena za všechna balení v Kč"
                  type="number"
                  fullWidth
                  control={control}
                />
                <Stack direction="column" spacing={0.5}>
                  <Typography color="text.secondary" fontSize="0.8rem" paddingLeft="0.2rem">
                    <Box component="span" color="success.main" fontWeight="bold">
                      Kontrola:{' '}
                    </Box>
                    Za 100 {unit} {getValues('itemName')} zaplatíte
                    <Box component="span" color="success" fontWeight="bold">
                      {` ${Math.round((price / quantity) * 100)} Kč`}
                    </Box>
                    <br />
                    Je tomu přibližně tak?
                  </Typography>
                </Stack>
                <TextField
                  fieldPath="threshold"
                  label="Minimální počet balení"
                  type="number"
                  control={control}
                  fullWidth
                />
              </>
            )
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
