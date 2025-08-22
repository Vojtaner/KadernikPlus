import { Button } from '@mui/material'
import FormDialog from '../Dialog'
import MenuIconButton from '../MenuIconButton'
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined'
import AddVisitForm, { useAddVisitForm } from '../Forms/AddVisitForm'
import { useState } from 'react'
import type { CreateVisitType } from '../../entities/visit'

export const AddVisitFormDialog = () => {
  const [open, setOpen] = useState(false)
  const { setIsNewClient, handleSubmit, createVisitMutation, ...formProps } = useAddVisitForm()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setIsNewClient(false)
    setOpen(false)
  }

  const onSubmit = (data: CreateVisitType) => {
    console.log({ data })
    createVisitMutation(data)
    handleClose()
  }

  return (
    <FormDialog<CreateVisitType>
      isOpen={open}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={<AddVisitForm {...formProps} setIsNewClient={setIsNewClient} />}
      handleSubmit={() => handleSubmit(onSubmit)}
      onOpenButton={
        <MenuIconButton icon={<MoreTimeOutlinedIcon fontSize="large" />} onClick={handleClickOpen} title="Objednat" />
      }
      title="Objednat"
    />
  )
}

export default AddVisitFormDialog
