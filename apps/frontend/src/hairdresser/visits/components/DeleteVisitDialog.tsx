import { Button } from '@mui/material'
import { useState } from 'react'
import FormDialog from '../../../app/components/Dialog'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { addPropsToReactElement } from '../../../components/entity'
import { useAppNavigate } from '../../../hooks'

type DeleteVisitDialogProps = {
  onConfirm: () => void
  openButton: React.ReactElement
}

const DeleteVisitDialog = (props: DeleteVisitDialogProps) => {
  const { openButton, onConfirm } = props
  const [open, setOpen] = useState(false)
  const navigate = useAppNavigate()

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
      title="Opravdu chcete smazat návštěvu?"
      dialogHelperText="Smaže se návštěva i související tržby."
    />
  )
}

export default DeleteVisitDialog
