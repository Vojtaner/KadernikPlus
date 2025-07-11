import { Button } from '@mui/material'
import React from 'react'
import FormDialog from './Dialog'
import MenuIconButton from './MenuIconButton'
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined'
import BasicDateTimePicker from './DateTimePicker'
import CustomerAutoComplete from './CustomerAutoComplete'
import HairCutAutoComplete from './HairCutAutoComplete'

export const AddVisitItemButton = () => {
  const [open, setOpen] = React.useState(false)

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
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={
        <>
          <BasicDateTimePicker />
          <CustomerAutoComplete />
          <HairCutAutoComplete />
        </>
      }
      onOpenButton={
        <MenuIconButton
          icon={<MoreTimeOutlinedIcon fontSize="large" />}
          onClick={handleClickOpen}
          title="Přidat návštěvu"
        />
      }
      title="Přidat návštěvu"
    />
  )
}

// type CustomerType = { id: string; name: string }

// const customerList = [
//   { id: '1', name: 'Jana Morečková' },
//   { id: '2', name: 'Magdaléna Suchá' },
//   { id: '3', name: 'Honza Navrátil' },
//   { id: '', name: 'Ludmila Křížová' },
// ]

export default AddVisitItemButton
