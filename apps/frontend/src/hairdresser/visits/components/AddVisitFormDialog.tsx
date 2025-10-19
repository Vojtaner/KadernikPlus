import { Button } from '@mui/material'
import FormDialog from '../../../app/components/FormDialog'

import AddVisitForm, { useAddVisitForm } from './AddVisitForm'
import { useState, type ReactElement } from 'react'
import type { CreateVisitType } from '../entity'
import { FormattedMessage, useIntl } from 'react-intl'
import { addPropsToReactElement } from '../../entity'

export const AddVisitFormDialog = (props: { openButton: ReactElement }) => {
  const [open, setOpen] = useState(false)
  const { setIsNewClient, handleSubmit, createVisitMutation, ...formProps } = useAddVisitForm()
  const intl = useIntl()

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
            <FormattedMessage id="formDialog.close" defaultMessage="Zavřít" />
          </Button>
          <Button type="submit">
            <FormattedMessage id="formDialog.save" defaultMessage="Uložit" />
          </Button>
        </>
      }
      formFields={<AddVisitForm {...formProps} setIsNewClient={setIsNewClient} />}
      handleSubmit={() => handleSubmit(onSubmit)}
      onOpenButton={addPropsToReactElement(props.openButton, { onClick: handleClickOpen })}
      title={intl.formatMessage({
        defaultMessage: 'Objednat',
        id: 'addVisitFormDialog.order',
      })}
    />
  )
}

export default AddVisitFormDialog
