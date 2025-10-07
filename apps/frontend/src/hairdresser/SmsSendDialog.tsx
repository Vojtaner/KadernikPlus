import { Button, type BoxProps, type SxProps } from '@mui/material'
import FormDialog from '../app/components/FormDialog'
import { useState } from 'react'
import React from 'react'
import {
  formatVisitInvitationToSms,
  formatVisitPartialPaymentReminderSms,
  formatVisitReviewRequestSms,
  groupVisits,
  SmsList,
} from './SmsTabs'
import QrCodeIcon from '@mui/icons-material/QrCode'
import AddAlertIcon from '@mui/icons-material/AddAlert'
import RateReviewIcon from '@mui/icons-material/RateReview'
import SendIcon from '@mui/icons-material/Send'
import AppTheme from '../AppTheme'
import { useClientVisitsQuery } from '../hairdresser/visits/queries'
import { useUserDataQuery } from '../queries'

const SmsSendDialog = (props: {
  openButton: React.ReactElement<{
    onClick: (e: React.MouseEvent) => void
    icon?: React.ReactNode
    sx?: SxProps<BoxProps>
  }>
  clientId: string
}) => {
  const { openButton, clientId } = props
  const [open, setOpen] = useState(false)
  const { data: clientData } = useClientVisitsQuery(clientId, open)
  const { data: userData } = useUserDataQuery()

  if (!clientData?.length) {
    const disabledOpenDialogButton = React.cloneElement(openButton, {
      icon: <SendIcon fontSize="small" color="disabled" />,
      sx: { background: `${AppTheme.palette.grey[200]}`, color: `${AppTheme.palette.grey[500]}` },
    })

    return disabledOpenDialogButton
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const openDialogButton = React.cloneElement(openButton, {
    onClick: (e: React.MouseEvent) => {
      openButton.props.onClick?.(e)
      handleClickOpen()
    },
  })

  const handleClose = () => {
    setOpen(false)
  }

  const groupedVisits = groupVisits(clientData)

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
          {groupedVisits.invitations.length ? (
            <SmsList
              visits={groupedVisits.invitations}
              title="Pozvánka"
              icon={<AddAlertIcon />}
              getText={(invitationVisit) =>
                formatVisitInvitationToSms(invitationVisit.client.lastName, invitationVisit.visitServices, {
                  date: invitationVisit.date,
                })
              }
            />
          ) : null}
          {groupedVisits.payments.length ? (
            <SmsList
              visits={groupedVisits.payments}
              title="Záloha"
              icon={<QrCodeIcon />}
              getText={(payment) =>
                formatVisitPartialPaymentReminderSms(
                  payment.client.lastName,
                  payment.visitServices,
                  userData?.bankAccount,
                  {
                    date: payment.date,
                    depositAmount: payment.deposit,
                    depositStatus: payment.depositStatus,
                    depositRequired: payment.client.deposit,
                  }
                )
              }
            />
          ) : null}
          {groupedVisits.reviews.length ? (
            <SmsList
              title="Recenze"
              icon={<RateReviewIcon />}
              visits={groupedVisits.reviews}
              getText={(review) => formatVisitReviewRequestSms(review.client.lastName, userData?.reviewUrl)}
            />
          ) : null}
        </>
      }
      onOpenButton={openDialogButton}
      title="Poslat zprávu"
    />
  )
}

export default SmsSendDialog
