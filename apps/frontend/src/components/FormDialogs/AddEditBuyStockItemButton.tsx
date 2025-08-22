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
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup'
import Loader from '../../pages/Loader'
import { useScrollToTheTop } from './AddProcedureButton'
import { FormattedMessage } from 'react-intl'

type AddEditBuyStockItemButtonProps = {
  defaultValues?: Partial<StockItemDefaultValuesType>
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>
  formUsage: 'purchase' | 'purchaseAndNewStockItem' | 'stockItem'
}

const AddEditBuyStockItemButton = (props: AddEditBuyStockItemButtonProps) => {
  const { defaultValues, openButton, formUsage } = props
  const scroll = useScrollToTheTop()

  const [open, setOpen] = useState(false)
  const { data: stocks, isLoading: isLoadingStocks } = useStocksQuery()
  const isOnlyShoppingForm = formUsage === 'purchase'
  const isPurchaseAndNewStockItemForm = formUsage === 'purchaseAndNewStockItem'
  const isNewStockItemForm = formUsage === 'stockItem'
  const { control, reset, handleSubmit, getValues } = useForm<StockItemDefaultValuesType>({
    defaultValues: {
      ...defaultValues,
    },
  })
  const [isPurchaseStockItem, setIsPurchaseStockItem] = useState(defaultValues ? false : true)
  const { mutate: createOrUpdateStockItemMutation } = useCreateOrUpdateStockItemMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockItems', stocks && stocks[0].id] })
      reset()
    },
  })
  const price = useWatch({ control, name: 'totalPrice' })
  const unit = useWatch({ control, name: 'unit' })
  const quantity = useWatch({ control, name: 'quantity' })
  const packageCount = useWatch({ control, name: 'packageCount' })

  if (stocks && !stocks.length && !isLoadingStocks) {
    throw new Error('Nepodařilo se načíst sklad.')
  }

  if (!stocks) {
    return <Loader />
  }

  const openDialogButton = React.cloneElement(openButton, {
    onClick: (e: React.MouseEvent) => {
      openButton.props.onClick?.(e)
      handleClickOpen()
    },
  })

  const handleClickOpen = () => {
    if (!defaultValues) {
      reset({
        id: undefined,
        itemName: undefined,
        quantity: undefined,
        totalPrice: undefined,
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
    scroll()
  }

  if (!stocks) {
    return null
  }

  const onSubmit = (data: StockItemDefaultValuesType) => {
    createOrUpdateStockItemMutation({ ...data, stockId: stocks[0].id })
    handleClose()
    scroll()
  }

  return (
    <FormDialog
      isOpen={open}
      handleSubmit={() => handleSubmit(onSubmit)}
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
                fieldPath="totalPrice"
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
                  fieldPath="totalPrice"
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
                      {` ${Math.round((price / (quantity * packageCount)) * 100)} Kč`}
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
