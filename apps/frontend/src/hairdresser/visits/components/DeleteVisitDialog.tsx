import { Button } from '@mui/material'
import { useState } from 'react'
import FormDialog from '../../../app/components/FormDialog'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useAppNavigate } from '../../../hooks'
import { addPropsToReactElement } from '../../entity'

type DeleteVisitDialogProps = {
  onConfirm: () => void
  openButton: React.ReactElement
}

const DeleteVisitDialog = (props: DeleteVisitDialogProps) => {
  const { openButton, onConfirm } = props
  const intl = useIntl()
  const navigate = useAppNavigate()
  const [open, setOpen] = useState(false)

  return (
    <FormDialog
      isOpen={open}
      onClose={() => setOpen(false)}
      actions={
        <>
          <Button onClick={() => setOpen(false)}>
            <FormattedMessage id="formDialog.close" defaultMessage="Zavřít" />
          </Button>
          <Button
            type="submit"
            onClick={() => {
              onConfirm()
              setOpen(false)
              navigate(-1)
            }}>
            <FormattedMessage id="formDialog.confirm" defaultMessage="Potvrdit" />
          </Button>
        </>
      }
      formFields={<></>}
      onOpenButton={addPropsToReactElement(openButton, {
        onClick: () => setOpen(true),
        color: 'error',
      })}
      title={intl.formatMessage({
        defaultMessage: 'Opravdu chcete smazat návštěvu?',
        id: 'deleteVisitDialog.closeWarningTitle',
      })}
      dialogHelperText={intl.formatMessage({
        defaultMessage: 'Opravdu chcete smazat návštěvu?',
        id: 'deleteVisitDialog.closeWarningText',
      })}
    />
  )
}

export default DeleteVisitDialog
