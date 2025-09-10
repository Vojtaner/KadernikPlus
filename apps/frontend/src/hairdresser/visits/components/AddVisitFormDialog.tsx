import { Button } from '@mui/material'
import FormDialog from '../../../app/components/Dialog'
import MenuIconButton from '../../../app/components/MenuBoxIcon'
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined'
import AddVisitForm, { useAddVisitForm } from './AddVisitForm'
import { useState } from 'react'
import type { CreateVisitType } from '../entity'
import { FormattedMessage } from 'react-intl'

export const AddVisitFormDialog = () => {
  const [open, setOpen] = useState(false)
  const { setIsNewClient, handleSubmit, title, createVisitMutation, ...formProps } = useAddVisitForm()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setIsNewClient(false)
    setOpen(false)
  }

  const onSubmit = (data: CreateVisitType) => {
    createVisitMutation(data)
    handleClose()
  }

  return (
    <FormDialog<CreateVisitType>
      isOpen={open}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose}>
            <FormattedMessage id="formDialog.close" defaultMessage={'Zavřít'} />
          </Button>
          <Button type="submit">
            <FormattedMessage id="formDialog.save" defaultMessage={'Uložit'} />
          </Button>
        </>
      }
      formFields={<AddVisitForm {...formProps} setIsNewClient={setIsNewClient} />}
      handleSubmit={() => handleSubmit(onSubmit)}
      onOpenButton={
        <MenuIconButton icon={<MoreTimeOutlinedIcon fontSize="large" />} onClick={handleClickOpen} title={title} />
      }
      title="Objednat"
    />
  )
}

export default AddVisitFormDialog
