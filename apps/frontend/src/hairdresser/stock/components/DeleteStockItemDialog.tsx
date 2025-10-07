import React, { useState } from 'react'
import FormDialog from '../../../app/components/FormDialog'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Typography } from '@mui/material'
import { addPropsToReactElement } from '../../entity'
import { useDeleteStockItemMutation } from '../queries'

type DeleteStockItemDialogProps = {
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>
  stockItemId: string
}

const DeleteStockItemDialog = (props: DeleteStockItemDialogProps) => {
  const { openButton, stockItemId } = props
  const [open, setOpen] = useState(false)
  const intl = useIntl()
  const { mutate: deleteStockItemMutation } = useDeleteStockItemMutation()

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
          <Button onClick={handleClose}>
            <FormattedMessage id="formDialog.close" defaultMessage="Zavřít" />
          </Button>
          <Button
            onClick={() => {
              deleteStockItemMutation(stockItemId)
              handleClose()
            }}>
            <FormattedMessage id="formDialog.delete" defaultMessage="Smazat" />
          </Button>
        </>
      }
      formFields={
        <Typography>
          <FormattedMessage
            id="stock.deleteStockItemWarning"
            defaultMessage="Smazání skladové zásoby přijdete o možnost editovat tuto položku u všech dotčených návštěv."
          />
        </Typography>
      }
      onOpenButton={addPropsToReactElement(openButton, {
        onClick: (e: React.MouseEvent) => {
          openButton.props.onClick?.(e)
          handleClickOpen()
        },
      })}
      title={intl.formatMessage({
        defaultMessage: 'Opravdu chcete smazat skladovou zásobu?',
        id: 'stockItem.deleteStockItem',
      })}
    />
  )
}

export default DeleteStockItemDialog
