import { Box, IconButton, Stack, Tab, Typography } from '@mui/material'
import SmsCard from '../app/components/SmsCard'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { TabPanel } from '@mui/lab'
import { useState, type ReactElement } from 'react'
import { getDateTimeFromUtcToLocal } from '../hairdresser/visits/components/VisitsList'
import { isWoman, vocative } from 'czech-vocative'
import { DepositStatus, type VisitService, type VisitWithServices } from '../hairdresser/visits/entity'
import Loader from '../hairdresser/pages/Loader'
import dayjs from 'dayjs'
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'
import { FormattedMessage } from 'react-intl'
import { useVisitsQuery } from '../hairdresser/visits/queries'
import { useUserDataQuery } from '../queries'

const SmsTabs = () => {
  const [value, setValue] = useState('1')
  const from = dayjs().subtract(4, 'day')
  const to = dayjs().add(8, 'day')
  const { data: userData } = useUserDataQuery()

  const { data: visitData, isLoading } = useVisitsQuery({ query: { from, to } })

  if (isLoading) {
    return <Loader />
  }
  if (!visitData) {
    return <Typography>Žádné SMS nenalezeny.</Typography>
  }

  const groupedVisits = groupVisits(visitData)

  const handleChange = (_: React.SyntheticEvent, newValue: string) => setValue(newValue)

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            <Tab label="Upozornění" value="1" />
            <Tab label="Zálohy" value="2" />
            <Tab label="Recenze" value="3" />
          </TabList>
        </Box>

        <TabPanel value="1" sx={{ py: 2, px: 0 }}>
          <SmsList
            icon={<InsertInvitationIcon />}
            visits={groupedVisits.invitations}
            getText={(invitationVisit) =>
              formatVisitInvitationToSms(invitationVisit.client.lastName, invitationVisit.visitServices, {
                date: invitationVisit.date,
              })
            }
          />
        </TabPanel>

        <TabPanel value="2" sx={{ py: 2, px: 0 }}>
          <SmsList
            visits={groupedVisits.payments}
            getText={(payment) =>
              formatVisitPartialPaymentReminderSms(
                payment.client.lastName,
                payment.visitServices,
                userData?.bankAccount,
                {
                  date: payment.date,
                  depositRequired: payment.client.deposit,
                  depositAmount: payment.deposit,
                  depositStatus: payment.depositStatus,
                }
              )
            }
          />
        </TabPanel>

        <TabPanel value="3" sx={{ py: 2, px: 0 }}>
          <SmsList
            visits={groupedVisits.reviews}
            getText={(review) => formatVisitReviewRequestSms(review.client.lastName)}
          />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default SmsTabs

export const SmsList = <T extends VisitWithServices>({
  visits,
  getText,
  icon,
  title,
}: {
  visits: T[]
  getText: (visit: T) => string
  title?: string
  icon?: ReactElement
}) => {
  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton href="#">{icon}</IconButton>
        <Typography
          color="secondary"
          sx={{
            fontSize: '15px',
            fontWeight: 600,
          }}>
          {title}
        </Typography>
      </Stack>
      {visits.map((visit) => (
        <SmsCard
          dataColumnNames={{
            name: <FormattedMessage defaultMessage="Jméno" id="firstNameLabel" />,
            serviceType: <FormattedMessage defaultMessage="Účes" id="hairCut" />,
            eventType: <FormattedMessage defaultMessage="Návštěva" id="visitLabel" />,
          }}
          key={visit.id}
          phoneContact={visit.client.phone}
          message={getText(visit)}
          customerName={`${visit.client.firstName} ${visit.client.lastName}`}
          service={visit.visitServices.map((s) => s.service.serviceName).join(', ')}
          daysDelta={getVisitDistanceLabel(visit.date)}
        />
      ))}
    </Stack>
  )
}

export function formatVisitInvitationToSms(lastName: string, services: VisitService[], visit: { date: Date }): string {
  const { date } = visit
  const serviceNames =
    services
      ?.map((visitService) => visitService.service?.serviceName?.trim())
      .filter(Boolean)
      .join(', ') || 'službu'

  const localDate = getDateTimeFromUtcToLocal(date)
  return `Dobrý den, ${isWoman(lastName) ? 'paní' : 'pane'} ${capitalizeFirstLetter(vocative(lastName))}, potvrzujeme Váš termín na službu ${serviceNames} v termín ${localDate}. Těšíme se na Vás!`
}

export function formatVisitReviewRequestSms(lastName: string): string {
  return `Dobrý den, ${isWoman(lastName) ? 'paní' : 'pane'} ${capitalizeFirstLetter(vocative(lastName))}, děkujeme za Vaši návštěvu. Budeme rádi za Vaše hodnocení a zpětnou vazbu. Děkujeme!`
}

export function formatVisitPartialPaymentReminderSms(
  lastName: string,
  services: VisitService[],
  bankAccount: string | undefined,
  visit: {
    date: Date
    depositRequired?: boolean | undefined
    depositStatus: DepositStatus | null | undefined
    depositAmount?: number | undefined
  }
): string {
  const { date, depositRequired, depositStatus, depositAmount } = visit

  const serviceNames =
    services
      ?.map((visitService) => visitService.service?.serviceName?.trim())
      .filter(Boolean)
      .join(', ') || 'službu'

  const localDate = getDateTimeFromUtcToLocal(date)
  const shouldPay = depositStatus === DepositStatus.NEZAPLACENO || depositRequired === false

  if (shouldPay) {
    return `Dobrý den, ${isWoman(lastName) ? 'paní' : 'pane'} ${capitalizeFirstLetter(vocative(lastName))}, připomínáme částečnou platbu ve výši ${depositAmount ? `${depositAmount} Kč` : 'CHYBÍ VÝŠE ZÁLOHY'} na číslo účtu ${bankAccount} za službu ${serviceNames}, která je naplánována na ${localDate}. Prosíme o její uhrazení. Děkujeme!`
  }
  return ''
}

const capitalizeFirstLetter = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

type VisitGroups = {
  invitations: VisitWithServices[]
  payments: VisitWithServices[]
  reviews: VisitWithServices[]
}

export function groupVisits(visits: VisitWithServices[]): VisitGroups {
  const now = new Date()

  const invitations: VisitWithServices[] = []
  const payments: VisitWithServices[] = []
  const reviews: VisitWithServices[] = []

  visits.forEach((visit) => {
    const visitDate = new Date(visit.date)
    const isFuture = visitDate > now
    const isPast = visitDate < now
    const unpaidDeposit = visit.depositStatus === DepositStatus.NEZAPLACENO && visit.client.deposit === true

    if (isFuture) {
      invitations.push(visit)
    }
    if (unpaidDeposit) {
      payments.push(visit)
    }
    if (isPast) {
      reviews.push(visit)
    }
  })

  return { invitations, payments, reviews }
}

const getVisitDistanceLabel = (visitDate: string | Date): string => {
  const today = new Date()
  const visit = new Date(visitDate)

  // Normalize both dates to midnight
  today.setHours(0, 0, 0, 0)
  visit.setHours(0, 0, 0, 0)

  const diffMs = visit.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'dnes'
  }
  if (diffDays > 0) {
    return `za ${diffDays} ${pluralizeDays(diffDays)}`
  }
  return `před ${Math.abs(diffDays)} ${pluralizeDays(Math.abs(diffDays))}`
}

const pluralizeDays = (count: number) => {
  if (count === 1) {
    return 'den'
  }
  if (count >= 2 && count <= 4) {
    return 'dny'
  }
  return 'dní'
}
