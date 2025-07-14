import { Button } from '@mui/material'
import { useState } from 'react'
import FormDialog from './Dialog'
import MenuIconButton from './MenuIconButton'
import TextField from './TextField'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import { unitList } from '../reactHookForm/entity'
import SelectField from './SelectField'
import { useCreateStockItemMutation } from '../queries'
import { useAppFormContext } from '../reactHookForm/store'

const AddStockItemButton = () => {
  const [open, setOpen] = useState(false)
  const { mutate: createStockItemMutation } = useCreateStockItemMutation()
  const { control } = useAppFormContext()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      onSubmitEndpoint={(stockItemData) => createStockItemMutation(stockItemData)}
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={
        <>
          <TextField fieldPath="itemName" label="Skladová položka" type="text" fullWidth />
          <SelectField
            items={unitList}
            control={control}
            sx={{ color: 'red' }}
            label={'Ahon'}
            keyExtractor={(unit) => unit.name}
            labelExtractor={(unit) => unit.name}
            fieldPath="unit"
          />
          <TextField fieldPath="quantity" label="Množství" type="number" fullWidth />
          <TextField fieldPath="threshold" label="Minimální množství" type="number" fullWidth />
        </>
      }
      onOpenButton={
        <MenuIconButton icon={<WarehouseIcon fontSize="large" />} onClick={handleClickOpen} title="Přidat sklad" />
      }
      title="Přidat položku na sklad"
      dialogHelperText="Toto není nákup. Zde přidáváte nový materiál."
    />
  )
}

export default AddStockItemButton
