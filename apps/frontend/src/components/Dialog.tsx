import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from './TextField'
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined'
import MenuIconButton from './MenuIconButton'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined'
import WarehouseIcon from '@mui/icons-material/Warehouse'

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
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
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
          },
        }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogHelperText}</DialogContentText>
          {formFields}
          {/* <TextField fieldPath="searchBar" label="Email Address" type="text" fullWidth variant="standard" /> */}
        </DialogContent>
        <DialogActions>
          {actions}
          {/* <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button> */}
        </DialogActions>
      </Dialog>
    </>
  )
}

export const AddBuyStockItemButton = () => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
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
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={<TextField fieldPath="searchBar" label="Email Address" type="text" fullWidth variant="standard" />}
      onOpenButton={
        <MenuIconButton icon={<AddShoppingCartOutlinedIcon />} onClick={handleClickOpen} title="Přidat nákup" />
      }
      title="Přidat nákup"
      dialogHelperText="Zde přidáte nakoupenou položku."
    />
  )
}

export const AddVisitItemButton = () => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
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
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={<TextField fieldPath="searchBar" label="Email Address" type="text" fullWidth variant="standard" />}
      onOpenButton={
        <MenuIconButton icon={<MoreTimeOutlinedIcon />} onClick={handleClickOpen} title="Přidat návštěvu" />
      }
      title="Přidat pložku na sklad"
    />
  )
}

export const AddWarehouseItemButton = () => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
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
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={<TextField fieldPath="searchBar" label="Email Address" type="text" fullWidth variant="standard" />}
      onOpenButton={<MenuIconButton icon={<WarehouseIcon />} onClick={handleClickOpen} title="Přidat sklad" />}
      title="Přidat položku na sklad"
      dialogHelperText="Zde přidáváte nový materiál. Ne nákup."
    />
  )
}
export const AddClientItemButton = () => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
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
          <Button onClick={handleClose}>Zavřít</Button>
          <Button type="submit">Uložit</Button>
        </>
      }
      formFields={<TextField fieldPath="searchBar" label="Email Address" type="text" fullWidth variant="standard" />}
      onOpenButton={
        <MenuIconButton icon={<PersonAddAlt1OutlinedIcon />} onClick={handleClickOpen} title="Přidat klienta" />
      }
      title="Přidat pložku na sklad"
    />
  )
}
