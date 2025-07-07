import { Button } from '@mui/material'
import { useState } from 'react'
import FormDialog from './Dialog'
import MenuIconButton from './MenuIconButton'
import TextField from './TextField'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import { unitList } from '../reactHookForm/store'
import SelectField from './SelectField'

const AddWarehouseItemButton = () => {
  const [open, setOpen] = useState(false)
  const [unit, setUnit] = useState('g')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSelectUnit = (unit: string) => {
    setUnit(unit)
  }

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={
        <>
          <TextField fieldPath="newWarehouseItemName" label="Skladová položka" type="text" fullWidth />
          <SelectField<{ id: string; name: string }>
            items={unitList}
            keyExtractor={(unit) => unit.id}
            labelExtractor={(unit) => unit.name}
            value={unit}
            onChange={onSelectUnit}
            // fieldPath="newWarehouseItemUnit"
          />
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

export default AddWarehouseItemButton
