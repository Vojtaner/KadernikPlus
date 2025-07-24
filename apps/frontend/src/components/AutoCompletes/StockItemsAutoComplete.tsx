import { Autocomplete, TextField, Typography } from '@mui/material'
import type { AppFieldPath, AppFormState } from '../../reactHookForm/entity'
import { Controller, type Control, type FieldPathValue } from 'react-hook-form'
import { useStockItemsQuery, useStocksQuery } from '../../queries'
import Loader from '../../pages/Loader'

type StockItemsAutoCompleteProps = {
  fieldPath: AppFieldPath
  control: Control<AppFormState>
  defaultValue?: FieldPathValue<AppFormState, AppFieldPath>
}

export default function StockItemsAutoComplete({ fieldPath, control, defaultValue }: StockItemsAutoCompleteProps) {
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
            onChange={(_, newValue) => field.onChange(newValue?.id ?? null)}
            isOptionEqualToValue={(option, value) => value != null && option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Vyberte položku" />}
          />
        )
      }}
    />
  )
}
