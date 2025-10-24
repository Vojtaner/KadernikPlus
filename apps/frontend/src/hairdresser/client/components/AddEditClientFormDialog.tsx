import { Button } from '@mui/material';
import FormDialog from '../../../app/components/FormDialog';
import { useState } from 'react';
import type { EditClient, NewClient } from '../../../entities/client';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ClientForm, { useClientForm } from './ClientForm';
import { addPropsToReactElement } from '../../entity';

type AddEditClientFormDialogProps = {
  defaultValues?: NewClient | EditClient;
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>;
  clientId?: string;
};

const AddEditClientFormDialog = (props: AddEditClientFormDialogProps) => {
  const { defaultValues, openButton, clientId } = props;
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  const { control, createOrUpdateClientMutation, handleSubmit, resetClientForm } =
    useClientForm(defaultValues);

  const handleClickOpen = () => {
    if (!defaultValues) {
      resetClientForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: NewClient | EditClient) => {
    createOrUpdateClientMutation(clientId ? { ...data, id: clientId } : data);
    handleClose();
  };

  return (
    <FormDialog<NewClient | EditClient>
      isOpen={open}
      onClose={handleClose}
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
      handleSubmit={() => handleSubmit(onSubmit)}
      formFields={<ClientForm control={control} />}
      onOpenButton={addPropsToReactElement(openButton, {
        onClick: (e: React.MouseEvent) => {
          openButton.props.onClick?.(e);
          handleClickOpen();
        },
      })}
      title={intl.formatMessage({ defaultMessage: 'Přidat klienta', id: 'clientDialog.addClient' })}
    />
  );
};

export default AddEditClientFormDialog;
