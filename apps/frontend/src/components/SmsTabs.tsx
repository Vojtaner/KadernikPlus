import { Box, Stack, Tab, Typography } from '@mui/material'
import SmsCard from './SmsCard'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { TabPanel } from '@mui/lab'
import { useState } from 'react'
import { useVisitsQuery } from '../queries'
import { getDateTime } from '../pages/VisitsList'
import { isWoman, vocative } from 'czech-vocative'
import { DepositStatus, type VisitWithServices } from '../entities/visit'
import Loader from '../pages/Loader'
import dayjs from 'dayjs'

const SmsTabs = () => {
  const [value, setValue] = useState('1')
  const from = dayjs().subtract(4, 'day')
  const to = dayjs().add(8, 'day')

  const { data: visitData, isLoading } = useVisitsQuery({ from, to })

  if (isLoading) {
    return <Loader />
  }

  if (!visitData) {
    return <Typography>Žádné SMS nenalezeny.</Typography>
  }
  const groupedVisits = groupVisits(visitData)

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Upozornění" value="1" />
            <Tab label="Zálohy" value="2" />
            <Tab label="Recenze" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ paddingY: 2, paddingX: 0 }}>
          <Stack spacing={2}>
            {groupedVisits.invitations.map((invitationVisit) => {
              return (
                <SmsCard
                  text={formatVisitToSms(invitationVisit)}
                  key={invitationVisit.id}
                  customerName={`${invitationVisit.client.firstName} ${invitationVisit.client.lastName}`}
                  haircut={invitationVisit.visitServices
                    .map((visitService) => visitService.service.serviceName)
                    .join(', ')}
                  visitDistance={getVisitDistanceLabel(invitationVisit.date)}
                />
              )
            })}
          </Stack>
        </TabPanel>
        <TabPanel value="2" sx={{ paddingY: 2, paddingX: 0 }}>
          <Stack spacing={2}>
            {groupedVisits.payments.map((payment) => {
              return (
                <SmsCard
                  text={formatVisitPartialPaymentReminderSms(payment)}
                  key={payment.id}
                  customerName={`${payment.client.firstName} ${payment.client.lastName}`}
                  haircut={payment.visitServices.map((visitService) => visitService.service.serviceName).join(', ')}
                  visitDistance={getVisitDistanceLabel(payment.date)}
                />
              )
            })}
          </Stack>
        </TabPanel>
        <TabPanel value="3" sx={{ paddingY: 2, paddingX: 0 }}>
          <Stack spacing={2}>
            {groupedVisits.reviews.map((review) => {
              return (
                <SmsCard
                  text={formatVisitReviewRequestSms(review)}
                  key={review.id}
                  customerName={`${review.client.firstName} ${review.client.lastName}`}
                  haircut={review.visitServices.map((visitService) => visitService.service.serviceName).join(', ')}
                  visitDistance={getVisitDistanceLabel(review.date)}
                />
              )
            })}
          </Stack>
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default SmsTabs

function formatVisitToSms(visit: VisitWithServices): string {
  const client = visit.client
  const firstName = client.firstName ?? ''
  const serviceNames =
    visit.visitServices
      ?.map((visitService) => visitService.service?.serviceName?.trim())
      .filter(Boolean)
      .join(', ') || 'službu'

  const date = getDateTime(visit.date)

  return `Dobrý den, ${isWoman(firstName) ? 'paní' : 'pane'} ${capitalizeFirstLetter(vocative(firstName))}, potvrzujeme Váš termín na službu ${serviceNames} v termín ${date}. Těšíme se na Vás!`
}

function formatVisitReviewRequestSms(visit: VisitWithServices): string {
  const client = visit.client
  const firstName = client.firstName ?? ''

  // const serviceNames =
  //   visit.visitServices
  //     ?.map((visitService) => visitService.service?.serviceName?.trim())
  //     .filter(Boolean)
  //     .join(', ') || 'službu'

  return `Dobrý den, ${isWoman(firstName) ? 'paní' : 'pane'} ${capitalizeFirstLetter(vocative(firstName))}, děkujeme za Vaši návštěvu. Budeme rádi za Vaše hodnocení a zpětnou vazbu. Děkujeme!`
}

function formatVisitPartialPaymentReminderSms(visit: VisitWithServices): string {
  const client = visit.client
  const firstName = client.firstName
  const serviceNames =
    visit.visitServices
      ?.map((visitService) => visitService.service?.serviceName?.trim())
      .filter(Boolean)
      .join(', ') || 'službu'

  const date = getDateTime(visit.date)
  const shouldPay = visit.depositStatus === DepositStatus.NEZAPLACENO || client.deposit === false

  if (shouldPay) {
    return `Dobrý den, ${isWoman(firstName) ? 'paní' : 'pane'} ${capitalizeFirstLetter(vocative(firstName))}, připomínáme částečnou platbu ve výši ${visit.deposit ? `${visit.deposit} Kč` : 'CHYBÍ VÝŠE ZÁLOHY'} za službu ${serviceNames}, která je naplánována na ${date}. Prosíme o její uhrazení. Děkujeme!`
  }
  return ''
}

const capitalizeFirstLetter = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

type VisitGroups = {
  invitations: VisitWithServices[]
  payments: VisitWithServices[]
  reviews: VisitWithServices[]
}

function groupVisits(visits: VisitWithServices[]): VisitGroups {
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
