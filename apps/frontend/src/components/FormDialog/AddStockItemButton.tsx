import { Button, Stack } from '@mui/material'
import { useState } from 'react'
import FormDialog from '../Dialog'
import MenuIconButton from '../MenuIconButton'
import TextField from '../TextField'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import { unitList } from '../../reactHookForm/entity'
import SelectField from '../SelectField'
import { useCreateStockItemMutation, useStocksQuery } from '../../queries'
import { useAppFormContext } from '../../reactHookForm/store'
import StockItemsAutoComplete from '../AutoCompletes/StockItemsAutoComplete'

const AddStockItemButton = () => {
  const [open, setOpen] = useState(false)
  const [isPurchaseStockItem, setIsPurchaseStockItem] = useState(true)
  const { control, reset } = useAppFormContext()
  const { mutate: createStockItemMutation } = useCreateStockItemMutation({
    onSuccess: () => {
      reset()
    },
  })
  const { data: stocks } = useStocksQuery()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (!stocks) {
    return null
  }

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      onSubmitEndpoint={(stockItemData) => {
        createStockItemMutation(stockItemData)
      }}
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={
        <>
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
          {isPurchaseStockItem ? (
            <>
              <StockItemsAutoComplete fieldPath="stockItemId" control={control} />
              <TextField fieldPath="quantity" label="Počet" type="number" fullWidth required />
              <TextField fieldPath="price" label="Cena" type="number" fullWidth />
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
              <TextField fieldPath="itemName" label="Skladová položka" type="text" fullWidth required />
              <SelectField
                items={unitList}
                control={control}
                keyExtractor={(unit) => unit.name}
                labelExtractor={(unit) => unit.name}
                fieldPath="unit"
              />
              <TextField fieldPath="quantity" label="Množství" type="number" fullWidth required />
              <TextField fieldPath="price" label="Cena celkem" type="number" fullWidth />
              <TextField fieldPath="threshold" label="Minimální množství" type="number" fullWidth />
            </>
          )}
        </>
      }
      onOpenButton={
        <MenuIconButton icon={<WarehouseIcon fontSize="large" />} onClick={handleClickOpen} title="Sklad" />
      }
      title="Přidat položku na sklad nebo evidovat nákup."
    />
  )
}

export default AddStockItemButton
const getButtonStyles = (active: boolean) => ({
  lineHeight: '18px',
  backgroundColor: active ? 'primary.main' : undefined,
  color: active ? 'white' : undefined,
})

// import { Button } from '@mui/material'
// import { useState } from 'react'
// import FormDialog from '../Dialog'
// import MenuIconButton from '../MenuIconButton'
// import TextField from '../TextField'
// import WarehouseIcon from '@mui/icons-material/Warehouse'
// import { unitList } from '../../reactHookForm/entity'
// import SelectField from '../SelectField'
// import { useCreateStockItemMutation, useStocksQuery } from '../../queries'
// import { useAppFormContext } from '../../reactHookForm/store'

// const AddStockItemButton = () => {
//   const [open, setOpen] = useState(false)
//   const { mutate: createStockItemMutation } = useCreateStockItemMutation()
//   const { data: stocks } = useStocksQuery()
//   const { control } = useAppFormContext()

//   const handleClickOpen = () => {
//     setOpen(true)
//   }

//   const handleClose = () => {
//     setOpen(false)
//   }

//   if (!stocks) {
//     return null
//   }

//   return (
//     <FormDialog
//       isOpen={open}
//       onClose={handleClose}
//       onSubmitEndpoint={(stockItemData) => createStockItemMutation(stockItemData)}
//       actions={
//         <>
//           <Button onClick={handleClose}>Zavřít</Button>
//           <Button type="submit">Uložit</Button>
//         </>
//       }
//       formFields={
//         <>
//           <SelectField
//             items={stocks.map((stock) => {
//               return { name: stock.stockName, id: stock.id }
//             })}
//             control={control}
//             keyExtractor={(stock) => stock.id}
//             labelExtractor={(stock) => stock.name}
//             fieldPath="stockId"
//           />
//           <TextField fieldPath="itemName" label="Skladová položka" type="text" fullWidth required />
//           <SelectField
//             items={unitList}
//             control={control}
//             keyExtractor={(unit) => unit.name}
//             labelExtractor={(unit) => unit.name}
//             fieldPath="unit"
//           />
//           <TextField fieldPath="quantity" label="Množství" type="number" fullWidth required />
//           <TextField fieldPath="price" label="Cena celkem" type="number" fullWidth />
//           <TextField fieldPath="threshold" label="Minimální množství" type="number" fullWidth />
//         </>
//       }
//       onOpenButton={
//         <MenuIconButton icon={<WarehouseIcon fontSize="large" />} onClick={handleClickOpen} title="Přidat sklad" />
//       }
//       title="Přidat položku na sklad"
//       dialogHelperText="Toto není nákup. Zde přidáváte nový materiál."
//     />
//   )
// }

// export default AddStockItemButton
