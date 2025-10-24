import { IconButton, Stack, Typography } from '@mui/material';
import SmsCard from '../app/components/SmsCard';

import { type ReactElement } from 'react';
import { isWoman, vocative } from 'czech-vocative';
import {
  DepositStatus,
  getDateTimeFromUtcToLocal,
  type VisitService,
  type VisitWithServices,
  type VisitWithServicesHotFix,
} from '../hairdresser/visits/entity';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';

// const SmsTabs = () => {
//   const [value, setValue] = useState('1')
//   const from = dayjs().subtract(4, 'day')
//   const to = dayjs().add(8, 'day')
//   const { data: userData } = useUserDataQuery()

//   const { data: visitData, isLoading } = useVisitsQuery({ query: { from, to } })

//   if (isLoading) {
//     return <Loader />
//   }
//   if (!visitData) {
//     return <Typography>Žádné SMS nenalezeny.</Typography>
//   }

//   const groupedVisits = groupVisits(visitData)

//   const handleChange = (_: React.SyntheticEvent, newValue: string) => setValue(newValue)

//   return (
//     <Box sx={{ width: '100%', typography: 'body1' }}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//           <TabList onChange={handleChange}>
//             <Tab label="Upozornění" value="1" />
//             <Tab label="Zálohy" value="2" />
//             <Tab label="Recenze" value="3" />
//           </TabList>
//         </Box>

//         <TabPanel value="1" sx={{ py: 2, px: 0 }}>
//           <SmsList
//             icon={<InsertInvitationIcon />}
//             visits={groupedVisits.invitations}
//             getText={(invitationVisit) =>
//               formatVisitInvitationToSms(invitationVisit.client.lastName, invitationVisit.visitServices, {
//                 date: invitationVisit.date,
//               })
//             }
//           />
//         </TabPanel>

//         <TabPanel value="2" sx={{ py: 2, px: 0 }}>
//           <SmsList
//             visits={groupedVisits.payments}
//             getText={(payment) =>
//               formatVisitPartialPaymentReminderSms(
//                 payment.client.lastName,
//                 payment.visitServices,
//                 userData?.bankAccount,
//                 {
//                   date: payment.date,
//                   depositRequired: payment.client.deposit,
//                   depositAmount: payment.deposit,
//                   depositStatus: payment.depositStatus,
//                 }
//               )
//             }
//           />
//         </TabPanel>

//         <TabPanel value="3" sx={{ py: 2, px: 0 }}>
//           <SmsList
//             visits={groupedVisits.reviews}
//             getText={(review) => formatVisitReviewRequestSms(review.client.lastName, userData?.reviewUrl)}
//           />
//         </TabPanel>
//       </TabContext>
//     </Box>
//   )
// }

// export default SmsTabs

export const SmsList = <T extends VisitWithServices>({
  visits,
  getText,
  icon,
  title,
}: {
  visits: T[];
  getText: (visit: T) => string;
  title?: string;
  icon?: ReactElement;
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
          }}
        >
          {title}
        </Typography>
      </Stack>
      {visits.map(visit => (
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
          service={visit.visitServices.map(s => s.service.serviceName).join(', ')}
          daysDelta={getVisitDistanceLabel(visit.date)}
        />
      ))}
    </Stack>
  );
};

export function formatVisitInvitationToSms(
  lastName: string,
  services: VisitService[],
  visit: { date: Date },
): string {
  const { date } = visit;
  const intl = useIntl();

  const serviceNames = intl.formatMessage(
    {
      id: 'smsSendDialog.invitationServiceNames',
      defaultMessage: '{service_name}',
    },
    {
      service_name:
        services
          ?.map(visitService => visitService.service?.serviceName?.trim())
          .filter(Boolean)
          .join(', ') || 'službu',
    },
  );

  const localDate = getDateTimeFromUtcToLocal(date);

  const invitationMessage = intl.formatMessage(
    {
      id: 'smsSendDialog.invitationMessage',
      defaultMessage:
        'Dobrý den, {pre_name} {last_name}, potvrzujeme Váš termín na službu {serviceNames} v termín {local_date}. Těšíme se na Vás!',
    },
    {
      pre_name: isWoman(lastName) ? 'paní' : 'pane',
      last_name: capitalizeFirstLetter(vocative(lastName)),
      service_names: serviceNames,
      local_date: localDate,
    },
  );

  return invitationMessage;
}

export function formatVisitReviewRequestSms(
  lastName: string,
  reviewUrl: string | undefined,
  intl: IntlShape,
): string {
  const reviewMessage = intl.formatMessage(
    {
      id: 'smsSendDialog.reviewMessage',
      defaultMessage:
        'Dobrý den, {pre_name} {last_name}, děkujeme za Vaši návštěvu. Budeme rádi za Vaše hodnocení a zpětnou vazbu. Zde odkaz: {review_url} Děkujeme!',
    },
    {
      pre_name: isWoman(lastName) ? 'paní' : 'pane',
      last_name: capitalizeFirstLetter(vocative(lastName)),
      review_url: reviewUrl,
    },
  );

  return reviewMessage;
}

export function formatVisitPartialPaymentReminderSms(
  lastName: string,
  services: VisitService[],
  bankAccount: string | undefined,
  visit: {
    date: Date;
    depositRequired?: boolean | undefined;
    depositStatus: DepositStatus | null | undefined;
    depositAmount?: number | undefined;
  },
): string {
  const { date, depositRequired, depositStatus, depositAmount } = visit;
  const intl = useIntl();

  const serviceNames = intl.formatMessage(
    {
      id: 'smsSendDialog.paymentServices',
      defaultMessage: '{service_name}',
    },
    {
      service_name:
        services
          ?.map(visitService => visitService.service?.serviceName?.trim())
          .filter(Boolean)
          .join(', ') || 'službu',
    },
  );

  const localDate = getDateTimeFromUtcToLocal(date);

  const shouldPay = depositStatus === DepositStatus.NEZAPLACENO || depositRequired === false;

  if (shouldPay) {
    const partialPayment = intl.formatMessage(
      {
        id: 'smsSendDialog.paymentMessage',
        defaultMessage:
          'Dobrý den, {pre_name} {last_name}, připomínáme částečnou platbu ve výši {deposit_amount} na číslo účtu {bank_account} za službu {service_names}, která je naplánována na {local_date}. Prosíme o její uhrazení. Děkujeme!',
      },
      {
        pre_name: isWoman(lastName) ? 'paní' : 'pane',
        last_name: capitalizeFirstLetter(vocative(lastName)),
        deposit_amount: depositAmount ? `${depositAmount} Kč` : 'CHYBÍ VÝŠE ZÁLOHY',
        bank_account: bankAccount,
        service_names: serviceNames,
        local_date: localDate,
      },
    );

    return partialPayment;
  }

  return '';
}

export const capitalizeFirstLetter = (name: string) => {
  if (!name) {
    return name;
  }

  const isFirstCharLetter = /^[\p{L}]/u.test(name);

  if (isFirstCharLetter) {
    return name.charAt(0).toLocaleUpperCase('cs-CZ') + name.slice(1).toLocaleLowerCase('cs-CZ');
  }

  return name;
};

type VisitGroups = {
  invitations: VisitWithServices[];
  payments: VisitWithServices[];
  reviews: VisitWithServices[];
};

export function sortAutoSms(visit: VisitWithServicesHotFix | undefined): VisitGroups | undefined {
  if (!visit) {
    return undefined;
  }

  const now = new Date();

  const invitations: VisitWithServices[] = [];
  const payments: VisitWithServices[] = [];
  const reviews: VisitWithServices[] = [];

  const visitDate = new Date(visit.date);
  const isFuture = visitDate > now;
  const isPast = visitDate < now;
  const daysSinceVisit = (now.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24);

  const unpaidDeposit =
    visit.depositStatus === DepositStatus.NEZAPLACENO && visit.client.deposit === true;

  if (isFuture) {
    invitations.push(visit);
  }

  if (unpaidDeposit && isFuture) {
    payments.push(visit);
  }

  if (isPast && daysSinceVisit <= 14) {
    reviews.push(visit);
  }

  return { invitations, payments, reviews };
}

const getVisitDistanceLabel = (visitDate: string | Date): string => {
  const today = new Date();
  const visit = new Date(visitDate);

  today.setHours(0, 0, 0, 0);
  visit.setHours(0, 0, 0, 0);

  const diffMs = visit.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'dnes';
  }
  if (diffDays > 0) {
    return `za ${diffDays} ${pluralizeDays(diffDays)}`;
  }
  return `před ${Math.abs(diffDays)} ${pluralizeDays(Math.abs(diffDays))}`;
};

const pluralizeDays = (count: number) => {
  if (count === 1) {
    return 'den';
  }
  if (count >= 2 && count <= 4) {
    return 'dny';
  }
  return 'dní';
};
