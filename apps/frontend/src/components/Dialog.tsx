import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Stack } from '@mui/material'
import type { FieldErrors } from 'react-hook-form'
import { useAppFormContext } from '../reactHookForm/store'
import type { AppFormState } from '../reactHookForm/entity'

type FormDialogProps = {
  actions: React.ReactNode
  formFields: React.ReactNode
  title: string
  dialogHelperText?: string
  onOpenButton: React.ReactNode
  isOpen: boolean
  onClose: () => void
  onSubmitEndpoint: (data: AppFormState) => void
}

export default function FormDialog(props: FormDialogProps) {
  const { actions, formFields, title, dialogHelperText, onOpenButton, isOpen, onClose, onSubmitEndpoint } = props

  const { handleSubmit } = useAppFormContext()

  const handleValidSubmit = (data: AppFormState) => {
    onSubmitEndpoint(data)
    onClose()
  }

  const handleInvalidSubmit = (errors: FieldErrors) => {
    console.warn('Form has errors:', errors)
  }

  return (
    <>
      {onOpenButton}
      <Dialog
        open={isOpen}
        onClose={onClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit(handleValidSubmit, handleInvalidSubmit),
            sx: {
              minWidth: '80vw',
            },
          },
        }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {dialogHelperText && <DialogContentText>{dialogHelperText}</DialogContentText>}
          <Stack direction="column" rowGap={2} paddingY={2}>
            {formFields}
          </Stack>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    </>
  )
}
