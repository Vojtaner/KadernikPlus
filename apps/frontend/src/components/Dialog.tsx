import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Stack } from '@mui/material'

type FormDialogProps = {
  actions: React.ReactNode
  formFields: React.ReactNode
  title: string
  dialogHelperText?: string
  onOpenButton: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

export default function FormDialog(props: FormDialogProps) {
  const { actions, formFields, title, dialogHelperText, onOpenButton, isOpen, onClose } = props

  return (
    <>
      {onOpenButton}
      <Dialog
        open={isOpen}
        onClose={onClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              const formData = new FormData(event.currentTarget)
              const formJson = Object.fromEntries(formData.entries())
              const email = formJson.email
              console.log(email)
              onClose()
            },
            sx: {
              minWidth: '70vw',
            },
          },
        }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {dialogHelperText && <DialogContentText sx={{ paddingBottom: '1rem' }}>{dialogHelperText}</DialogContentText>}
          <Stack direction="column" rowGap={2}>
            {formFields}
          </Stack>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    </>
  )
}
