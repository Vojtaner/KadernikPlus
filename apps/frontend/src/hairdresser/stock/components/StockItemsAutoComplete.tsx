import { type Control, type FieldPath, type FieldPathValue, type FieldValues, type Path } from 'react-hook-form'
import Loader from '../../pages/Loader'
import { queryClient } from '../../../reactQuery/reactTanstackQuerySetup'
import AutoComplete from '../../../app/components/AutoComplete'
import { FormattedMessage } from 'react-intl'
import { useStocksQuery, useStockItemsQuery } from '../queries'

type StockItemsAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: Path<TFieldValues>
  control: Control<TFieldValues>
  defaultValue?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
}

const StockItemsAutoComplete = <TFieldValues extends FieldValues>(props: StockItemsAutoCompleteProps<TFieldValues>) => {
  const { control, fieldPath, defaultValue } = props
  const { data: stocks } = useStocksQuery()
  const { data: stockItems, isLoading, isError } = useStockItemsQuery(stocks ? stocks[0].id : undefined)

  if (isLoading) {
    return <Loader />
  }

  if (!stockItems || isError) {
    return <FormattedMessage defaultMessage={'Skladové položky nebyly nalezeny.'} id="stockItem.notFound" />
  }

  const stockItemsOptions = stockItems.map((stockItem) => ({
    id: stockItem.id,
    name: stockItem.itemName,
  }))

  return (
    <AutoComplete
      options={stockItemsOptions}
      defaultValue={defaultValue}
      control={control}
      fieldPath={fieldPath}
      label="Vyberte položku"
      onChange={() => {
        queryClient.invalidateQueries({ queryKey: ['procedures'] })
      }}
    />
  )
}

export default StockItemsAutoComplete
