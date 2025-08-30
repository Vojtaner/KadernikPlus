import { Button, List } from '@mui/material'
import { useState } from 'react'
import FormDialog from '../Dialog'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { addPropsToReactElement } from '../entity'
import CloseIcon from '@mui/icons-material/Close'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { IconListItem } from '../../app/components/IconListItem'

type CloseVisitDialogProps = {
  canSkipDialog: boolean
  onConfirm: () => void
  openButton: React.ReactElement
  errors?: string[]
  missingStockAllowanceError: string | undefined
  checked: boolean
}

const CloseVisitDialog = (props: CloseVisitDialogProps) => {
  const { openButton, canSkipDialog, onConfirm, errors, missingStockAllowanceError, checked } = props
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    if (canSkipDialog || checked) {
      onConfirm()
    } else {
      setOpen(true)
    }
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
          <Button onClick={handleClose}>
            <FormattedMessage id="formDialog.close" defaultMessage="Zavřít" />
          </Button>
          <Button
            disabled={errors?.length !== 0}
            type="button"
            onClick={() => {
              onConfirm()
              handleClose()
            }}>
            {errors?.length === 0 && missingStockAllowanceError ? (
              <FormattedMessage id="formDialog.confirmWithoutStockAllowances" defaultMessage="Potvrdit bez procedury" />
            ) : (
              <FormattedMessage id="formDialog.confirm" defaultMessage="Potvrdit" />
            )}
          </Button>
        </>
      }
      formFields={
        <>
          {errors && (
            <List dense>
              {errors.map((error) => (
                <IconListItem key={error} icon={<CloseIcon fontSize="small" color="primary" />} message={error} />
              ))}
              {missingStockAllowanceError && (
                <IconListItem
                  key={missingStockAllowanceError}
                  icon={<QuestionMarkIcon fontSize="small" color="primary" />}
                  message={missingStockAllowanceError}
                />
              )}
            </List>
          )}
        </>
      }
      onOpenButton={addPropsToReactElement(openButton, {
        onClick: handleClick,
        color: 'error',
      })}
      title="Nelze uzavřít návštěvu"
      dialogHelperText="Ve formuláři nemáte vyplněné následující údaje."
    />
  )
}

export default CloseVisitDialog
