import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Stack } from '@mui/material'
import type { AppFormState } from '../reactHookForm/entity'

import type { UseFormHandleSubmit } from 'react-hook-form'

type FormDialogProps = {
  actions: React.ReactNode
  formFields: React.ReactNode
  title: string
  dialogHelperText?: string
  onOpenButton: React.ReactNode
  isOpen: boolean
  onClose: () => void
  handleSubmit: UseFormHandleSubmit<AppFormState>
}

export default function FormDialog(props: FormDialogProps) {
  const { actions, formFields, title, dialogHelperText, onOpenButton, isOpen, onClose, handleSubmit } = props

  const onValidHandle = () => {}
  const onInvalidHandle = () => {}

  return (
    <>
      {onOpenButton}
      <Dialog
        open={isOpen}
        onClose={onClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              handleSubmit(onValidHandle, onInvalidHandle)()
            },
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
