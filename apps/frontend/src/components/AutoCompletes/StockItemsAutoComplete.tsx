import { Autocomplete, TextField, Typography } from '@mui/material'
import type { AppFieldPath } from '../../reactHookForm/entity'
import { Controller, type Control, type FieldPath, type FieldPathValue, type FieldValues } from 'react-hook-form'
import { useStockItemsQuery, useStocksQuery } from '../../queries'
import Loader from '../../pages/Loader'
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup'

type StockItemsAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: AppFieldPath
  control: Control<TFieldValues>
  defaultValue?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
}

export default function StockItemsAutoComplete<TFieldValues extends FieldValues>({
  fieldPath,
  control,
  defaultValue,
}: StockItemsAutoCompleteProps<TFieldValues>) {
  const { data: stocks } = useStocksQuery()
  const { data: stockItems, isLoading, isError } = useStockItemsQuery(stocks ? stocks[0].id : undefined)

  if (isLoading) {
    return <Loader />
  }

  if (!stockItems || isError) {
    return <Typography>Žádní členové týmu nebyli nalezeni.</Typography>
  }

  const stockItemsOptions = stockItems.map((stockItem) => ({
    id: stockItem.id,
    name: stockItem.itemName,
  }))

  return (
    <Controller
      name={fieldPath}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => {
        const selectedOption = stockItemsOptions.find((option) => option.id === field.value) || null

        return (
          <Autocomplete
            options={stockItemsOptions}
            getOptionLabel={(option) => option.name}
            value={selectedOption}
            onChange={(_, newValue) => {
              queryClient.invalidateQueries({ queryKey: ['procedures'] })
              return field.onChange(newValue?.id ?? null)
            }}
            isOptionEqualToValue={(option, value) => value != null && option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Vyberte položku" />}
          />
        )
      }}
    />
  )
}
