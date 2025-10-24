import { Button, type BoxProps, type SxProps } from '@mui/material';
import FormDialog from '../app/components/FormDialog';
import { useState } from 'react';
import React from 'react';
import {
  formatVisitInvitationToSms,
  formatVisitPartialPaymentReminderSms,
  formatVisitReviewRequestSms,
  SmsList,
  sortAutoSms,
} from './SmsTabs';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useVisitQuery } from '../hairdresser/visits/queries';
import { useUserDataQuery } from '../queries';
import { useIntl } from 'react-intl';

const SmsSendDialog = (props: {
  openButton: React.ReactElement<{
    onClick: (e: React.MouseEvent) => void;
    icon?: React.ReactNode;
    sx?: SxProps<BoxProps>;
  }>;
  visitId: string;
}) => {
  const { openButton, visitId } = props;
  const [open, setOpen] = useState(false);
  const { data: visitData } = useVisitQuery(visitId, open);
  const { data: userData } = useUserDataQuery();
  const intl = useIntl();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const openDialogButton = React.cloneElement(openButton, {
    onClick: (e: React.MouseEvent) => {
      openButton.props.onClick?.(e);
      handleClickOpen();
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const groupedVisits = sortAutoSms(visitData);

  return (
    <FormDialog
      isOpen={open}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose}>Zavřít</Button>
        </>
      }
      formFields={
        <>
          {groupedVisits && (
            <>
              {groupedVisits.invitations.length ? (
                <SmsList
                  visits={groupedVisits.invitations}
                  title={intl.formatMessage({
                    id: 'smsSendDialog.invitation',
                    defaultMessage: 'Pozvánka',
                  })}
                  icon={<AddAlertIcon />}
                  getText={invitationVisit =>
                    formatVisitInvitationToSms(
                      invitationVisit.client.lastName,
                      invitationVisit.visitServices,
                      {
                        date: invitationVisit.date,
                      },
                    )
                  }
                />
              ) : null}
              {groupedVisits.payments.length ? (
                <SmsList
                  visits={groupedVisits.payments}
                  title={intl.formatMessage({
                    id: 'smsSendDialog.deposit',
                    defaultMessage: 'Záloha',
                  })}
                  icon={<QrCodeIcon />}
                  getText={payment =>
                    formatVisitPartialPaymentReminderSms(
                      payment.client.lastName,
                      payment.visitServices,
                      userData?.bankAccount,
                      {
                        date: payment.date,
                        depositAmount: payment.deposit,
                        depositStatus: payment.depositStatus,
                        depositRequired: payment.client.deposit,
                      },
                    )
                  }
                />
              ) : null}
              {groupedVisits.reviews.length ? (
                <SmsList
                  title={intl.formatMessage({
                    id: 'smsSendDialog.review',
                    defaultMessage: 'Recenze',
                  })}
                  icon={<RateReviewIcon />}
                  visits={groupedVisits.reviews}
                  getText={review =>
                    formatVisitReviewRequestSms(review.client.lastName, userData?.reviewUrl, intl)
                  }
                />
              ) : null}
            </>
          )}
        </>
      }
      onOpenButton={openDialogButton}
      title={intl.formatMessage({
        id: 'smsSendDialog.sendMessage',
        defaultMessage: 'Poslat zprávu',
      })}
    />
  );
};

export default SmsSendDialog;
