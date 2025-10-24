import { Button } from '@mui/material';
import { useState } from 'react';
import FormDialog from '../../../app/components/FormDialog';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { addPropsToReactElement } from '../../entity';

type DeleteDialogProps = {
  onConfirm: () => void;
  openButton: React.ReactElement;
  dialogHelperText?: string;
  title?: string;
};

const DeleteDialog = (props: DeleteDialogProps) => {
  const { openButton, onConfirm, dialogHelperText, title } = props;
  const [open, setOpen] = useState(false);

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
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            <FormattedMessage id="formDialog.confirm" defaultMessage="Potvrdit" />
          </Button>
        </>
      }
      formFields={<></>}
      onOpenButton={addPropsToReactElement(openButton, {
        onClick: () => setOpen(true),
        color: 'error',
      })}
      title={title ?? ''}
      dialogHelperText={dialogHelperText}
    />
  );
};

export default DeleteDialog;
