import { Button, List } from '@mui/material'
import FormDialog from '../../../app/components/FormDialog'
import { FormattedMessage } from 'react-intl'
import CloseIcon from '@mui/icons-material/Close'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { IconListItem } from '../../../app/components/IconListItem'

type CloseVisitDialogProps = {
  onConfirm: () => void
  errors?: string[]
  missingStockAllowanceError: string | undefined
  openDialog: boolean
  onClose: () => void
}

const CloseVisitDialog = (props: CloseVisitDialogProps) => {
  const { errors, missingStockAllowanceError, onConfirm, onClose, openDialog = false } = props

  const handleClose = () => {
    onClose()
  }

  return (
    <FormDialog
      isOpen={openDialog}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose}>
            <FormattedMessage id="formDialog.close" defaultMessage="Zavřít" />
          </Button>
          {errors?.length === 0 && missingStockAllowanceError ? (
            <Button
              disabled={errors?.length !== 0}
              type="button"
              onClick={() => {
                onConfirm()
                handleClose()
              }}>
              <FormattedMessage id="formDialog.confirmWithoutStockAllowances" defaultMessage="Potvrdit bez procedury" />
            </Button>
          ) : null}
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
      title="Nelze uzavřít návštěvu"
      dialogHelperText="Ve formuláři nemáte vyplněné následující údaje."
    />
  )
}

export default CloseVisitDialog
