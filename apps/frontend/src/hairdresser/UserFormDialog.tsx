import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from '@mui/material'
import TextField from '../app/components/TextField'
import { useUpdateUserMutation } from '../queries'
import type { UserForm } from '../entities/user'
import { useForm } from 'react-hook-form'
import FormDialog from '../app/components/FormDialog'
import { addPropsToReactElement } from './entity'

const useUserProfileForm = () => {
  const { mutation: updateUser } = useUpdateUserMutation()
  const { control, handleSubmit } = useForm<UserForm>()

  return { control, handleSubmit, updateUser: (data: UserForm) => updateUser.mutate(data) }
}

export const UserProfilDialog = (props: {
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>
}) => {
  const { openButton } = props
  const { control, updateUser, handleSubmit } = useUserProfileForm()
  const [open, setOpen] = useState(false)
  const intl = useIntl()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data: UserForm) => {
    updateUser(data)
    handleClose()
  }

  return (
    <FormDialog<UserForm>
      isOpen={open}
      onClose={handleClose}
      handleSubmit={() => handleSubmit(onSubmit)}
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
      formFields={
        <>
          <TextField
            control={control}
            fieldPath="bankAccount"
            type="text"
            label={intl.formatMessage({ defaultMessage: 'Bankovní účet', id: 'userProfile.bankAccount' })}
          />
          <TextField
            control={control}
            fieldPath="reviewUrl"
            type="text"
            label={intl.formatMessage({ defaultMessage: 'Odkaz na recenze.', id: 'userProfile.reviewUrl' })}
          />
        </>
      }
      onOpenButton={addPropsToReactElement(openButton, {
        onClick: (e: React.MouseEvent) => {
          openButton.props.onClick?.(e)
          handleClickOpen()
        },
      })}
      dialogHelperText={intl.formatMessage({
        defaultMessage: 'Upravit lze pouze tato data, ostatní nevlastníme.',
        id: 'userProfile.helperText',
      })}
      title={intl.formatMessage({ defaultMessage: 'Upravit vaše údaje', id: 'userProfile.editFormTitle' })}
    />
  )
}
