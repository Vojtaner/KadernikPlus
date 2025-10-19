import { Stack, Button, Typography, Box } from '@mui/material'
import TextField from '../../../app/components/TextField'
import SelectField from '../../../app/components/SelectField'
import { unitList } from '../../../reactHookForm/entity'
import { useForm, useWatch } from 'react-hook-form'
import { queryClient } from '../../../reactQuery/reactTanstackQuerySetup'
import { useState } from 'react'
import type { StockItemDefaultValuesType, StockItemFormUsagePurposeType } from '../entity'
import { FormattedMessage, useIntl } from 'react-intl'
import StockItemsAutoComplete from './StockItemsAutoComplete'
import { useCreateOrUpdateStockItemMutation, useStocksQuery } from '../queries'
import { getButtonStyles } from '../../entity'

type StockItemFormProps = Omit<
  ReturnType<typeof useStockItemForm>,
  'reset' | 'stocks' | 'isLoading' | 'createOrUpdateStockItemMutation' | 'handleSubmit'
> & { formUsagePurpose: StockItemFormUsagePurposeType }

export const StockItemForm = (props: StockItemFormProps) => {
  const intl = useIntl()
  const {
    control,
    isPurchaseStockItem,
    setIsPurchaseStockItem,
    formUsagePurpose,
    stockItem: { unit },
  } = props

  const itemNameWatch = useWatch({ control, name: 'itemName' })
  const packageCount = useWatch({ control, name: 'packageCount' })
  const totalPrice = useWatch({ control, name: 'totalPrice' })
  const pricePerPackage = totalPrice / packageCount

  const isOnlyShoppingForm = formUsagePurpose === 'purchase'
  const isPurchaseAndNewStockItemForm = formUsagePurpose === 'purchaseAndNewStockItem'
  const isNewStockItemForm = formUsagePurpose === 'stockItem'

  return (
    <>
      {isPurchaseAndNewStockItemForm && (
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            fullWidth
            sx={getButtonStyles(!isPurchaseStockItem)}
            onClick={() => setIsPurchaseStockItem(false)}>
            <FormattedMessage id="stockItem.newStockItem" defaultMessage="Nová položka" />
          </Button>
          <Button
            size="small"
            fullWidth
            sx={getButtonStyles(isPurchaseStockItem)}
            onClick={() => setIsPurchaseStockItem(true)}>
            <FormattedMessage id="stockItem.purchaseButton" defaultMessage="Nákup položky" />
          </Button>
        </Stack>
      )}

      {isPurchaseStockItem || isOnlyShoppingForm ? (
        <>
          <StockItemsAutoComplete fieldPath="id" control={control} />
          <Stack direction="row" spacing={1}>
            <TextField
              fieldPath="packageCount"
              label={<FormattedMessage id="stockItem.packageCount" defaultMessage="Počet balení" />}
              type="number"
              required
              control={control}
            />
            <TextField
              fieldPath="quantity"
              label={
                <FormattedMessage
                  id="stockItem.packageQuantity"
                  defaultMessage={`Množství v jednom balení v ${unit ?? ''}`}
                />
              }
              type="number"
              fullWidth
              required
              control={control}
            />
          </Stack>
          <TextField
            fieldPath="totalPrice"
            label={<FormattedMessage id="stockItem.totalPrice" defaultMessage="Cena za všechna balení v Kč" />}
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
              label={<FormattedMessage id="stockItem.itemName" defaultMessage="Skladová položka" />}
              type="text"
              fullWidth
              required
            />

            <SelectField
              items={unitList}
              label={intl.formatMessage({ id: 'stockItem.unit', defaultMessage: 'Vyberte jednotku materiálu' })}
              control={control}
              fieldPath="unit"
              keyExtractor={(u) => u.name}
              labelExtractor={(u) => u.name}
            />

            <Stack direction="row" spacing={1}>
              <TextField
                fieldPath="packageCount"
                label={<FormattedMessage id="stockItem.packageCount" defaultMessage="Počet balení" />}
                type="number"
                required
                control={control}
              />
              <TextField
                fieldPath="quantity"
                label={
                  <FormattedMessage
                    id="stockItem.quantity"
                    defaultMessage={`Množství v jednom balení v ${unit ?? ''}`}
                  />
                }
                type="number"
                fullWidth
                required
                control={control}
              />
            </Stack>
            <TextField
              fieldPath="totalPrice"
              label={<FormattedMessage id="stockItem.totalPrice" defaultMessage="Cena za všechna balení v Kč" />}
              type="number"
              fullWidth
              control={control}
            />
            {itemNameWatch && pricePerPackage ? (
              <Stack direction="column" spacing={0.5}>
                <Typography color="text.secondary" fontSize="0.8rem" paddingLeft="0.2rem">
                  <Box component="span" color="success.main" fontWeight="bold">
                    <FormattedMessage id="stockItem.checkTitle" defaultMessage="Kontrola: " />
                  </Box>
                  <FormattedMessage
                    id="stockItem.checkCalculation"
                    defaultMessage={` Za 1 balení ${itemNameWatch} zaplatíte`}
                  />
                  <Box component="span" color="success" fontWeight="bold">{` ${Math.round(pricePerPackage)} Kč`}</Box>
                  <br />
                  <FormattedMessage id="stockItem.checkQuestion" defaultMessage="Je tomu přibližně tak?" />
                </Typography>
              </Stack>
            ) : null}
            <TextField
              fieldPath="threshold"
              required
              label={intl.formatMessage({
                id: 'stockItem.minimumPackageCount',
                defaultMessage: 'Minimální počet balení',
              })}
              type="number"
              control={control}
              fullWidth
            />
          </>
        )
      )}
    </>
  )
}

export default StockItemForm

export const useStockItemForm = (defaultValues?: Partial<StockItemDefaultValuesType>) => {
  const [isPurchaseStockItem, setIsPurchaseStockItem] = useState(defaultValues ? false : true)
  const { data: stocks, isLoading } = useStocksQuery()
  const { control, reset, handleSubmit, getValues } = useForm<StockItemDefaultValuesType>({
    defaultValues: { ...defaultValues },
  })
  const { mutate: createOrUpdateStockItemMutation } = useCreateOrUpdateStockItemMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockItems', stocks && stocks[0]?.id] })
      reset()
    },
  })

  const lastPackageQuantity = useWatch({ control, name: 'lastPackageQuantity' })
  const unit = useWatch({ control, name: 'unit' })
  const avgUnitPrice = useWatch({ control, name: 'avgUnitPrice' })

  return {
    control,
    reset,
    handleSubmit,
    getValues,
    stocks,
    isLoading,
    isPurchaseStockItem,
    setIsPurchaseStockItem,
    stockItem: { avgUnitPrice, unit, lastPackageQuantity },
    createOrUpdateStockItemMutation,
  }
}
