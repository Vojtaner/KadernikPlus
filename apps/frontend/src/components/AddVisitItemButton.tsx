import { Button } from '@mui/material'
import FormDialog from './Dialog'
import MenuIconButton from './MenuIconButton'
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined'
import BasicDateTimePicker from './DateTimePicker'
import ClientAutoComplete from './ClientAutoComplete'
import HairCutAutoComplete from './HairCutAutoComplete'
import { useAppFormContext } from '../reactHookForm/store'
import { useCreateVisitMutation } from '../queries'
import { useState } from 'react'

export const AddVisitItemButton = () => {
  const [open, setOpen] = useState(false)
  const { control } = useAppFormContext()
  const { mutate: createVisitMutation } = useCreateVisitMutation()

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
          <BasicDateTimePicker fieldPath="date" control={control} />
          <ClientAutoComplete fieldPath="clientId" control={control} />
          <HairCutAutoComplete fieldPath="serviceIds" control={control} />
        </>
      }
      onSubmitEndpoint={(visitData) => createVisitMutation(visitData)}
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
